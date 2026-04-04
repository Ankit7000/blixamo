#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════
//  BLIXAMO BAYESIAN SUPERVISOR v1.0
//  Meta-level guardian — watches the checker, detects loops,
//  self-heals, escalates via email when P(self-heal) collapses
// ═══════════════════════════════════════════════════════════════════
//
//  ARCHITECTURE (strictly enforced):
//
//  ┌─────────────────────────────────────────────────────────────┐
//  │  SUPERVISOR (this file) — runs every 30 min via cron        │
//  │  • Reads state from STATE_FILE (never calls itself)         │
//  │  • Watches CHECKER outputs + system vitals                  │
//  │  • Bayesian confidence per fix-type                         │
//  │  • Loop detection: thrash + stuck + hung                    │
//  │  • Self-heals up to SELF_HEAL_BUDGET per 24h               │
//  │  • Escalates via n8n → Gmail when budget exhausted          │
//  └──────────────────────────┬──────────────────────────────────┘
//                             │ reads/writes
//  ┌──────────────────────────▼──────────────────────────────────┐
//  │  STATE FILE: /var/log/blixamo-supervisor-state.json         │
//  │  • fix history per type (attempts, successes, failures)     │
//  │  • recent timestamps per fix (loop detection window)        │
//  │  • escalation log (what was sent, when)                     │
//  │  • checker run history (issues over time)                   │
//  │  • supervisor own health (consecutive failures, budget)     │
//  └─────────────────────────────────────────────────────────────┘
//
//  ANTI-LOOP LAWS:
//  LAW 1 — Supervisor NEVER spawns itself or the checker
//  LAW 2 — Each fix type: max 3 attempts per 2h window (thrash gate)
//  LAW 3 — Each fix type: confidence P = (s+1)/(a+2). P<0.25 → stop, escalate
//  LAW 4 — Self-heal budget: max 5 heals per 24h total (all types combined)
//  LAW 5 — If 3 consecutive checker runs show same issues → escalate, stop fixing
//  LAW 6 — Supervisor itself: if 3 consecutive supervisor crashes → reboot VPS
// ═══════════════════════════════════════════════════════════════════

'use strict';
const { execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');
const os   = require('os');

// ── CONFIG ──────────────────────────────────────────────────────
const CFG = {
  STATE_FILE:        '/var/log/blixamo-supervisor-state.json',
  CHECKER_LOG:       '/var/log/blixamo-checker.log',
  CHECKER_SCRIPT:    '/var/www/blixamo/tools/blixamo-checker.js',
  SUPERVISOR_LOG:    '/var/log/blixamo-supervisor.log',
  ALERT_LOG:         '/var/log/blixamo-supervisor-alerts.log',
  PM2_ERR_LOG:       '/root/.pm2/logs/blixamo-error.log',
  LOCK_FILE:         '/tmp/blixamo-checker.lock',
  BLIXAMO_DIR:       '/var/www/blixamo',
  N8N_WEBHOOK_URL:   'http://localhost:5679/webhook/supervisor-alert',
  ALERT_EMAIL:       'ankitsorathiya1991@gmail.com',
  SMTP_CRED_ID:      'Kf8mqV16YEtPPKfy',
  SELF_HEAL_BUDGET:  5,           // max heals per 24h (all types combined)
  THRASH_WINDOW_MS:  2 * 3600000, // 2 hours
  THRASH_MAX:        3,           // max same-fix in window
  MIN_CONFIDENCE:    0.25,        // below this → stop fixing, escalate
  STUCK_RUNS:        3,           // consecutive runs with same issues = stuck
  CHECKER_TIMEOUT:   25 * 60000,  // checker should finish in 25min
  SUPERVISOR_CRASH_MAX: 3,        // supervisor crashes before VPS reboot
};

// ── COLORS ──────────────────────────────────────────────────────
const C = { r:'\x1b[0m', bold:'\x1b[1m', red:'\x1b[31m', green:'\x1b[32m',
  yellow:'\x1b[33m', blue:'\x1b[34m', cyan:'\x1b[36m', gray:'\x1b[90m', magenta:'\x1b[35m' };
const clr  = (c, t) => `${C[c]}${t}${C.r}`;
const ts   = () => new Date().toISOString().replace('T',' ').slice(0,19);

// ── UTILS ────────────────────────────────────────────────────────
function run(cmd, timeout=15000) {
  try { return { ok:true,  out: execSync(cmd,{encoding:'utf8',timeout,stdio:['pipe','pipe','pipe']}).trim() }; }
  catch(e) { return { ok:false, out:(e.stdout||e.message||'').slice(0,300) }; }
}
const readJSON  = fp => { try { return JSON.parse(fs.readFileSync(fp,'utf8')); } catch { return null; } };
const writeJSON = (fp, data) => fs.writeFileSync(fp, JSON.stringify(data, null, 2));
const readFile  = fp => { try { return fs.readFileSync(fp,'utf8'); } catch { return ''; } };
const now       = () => Date.now();
const nowISO    = () => new Date().toISOString();

// ── LOGGING ──────────────────────────────────────────────────────
function log(level, msg) {
  const line = `[${ts()}] [${level}] ${msg}`;
  console.log(line);
}
const INFO  = m => log('INFO ', clr('gray', m));
const PASS  = m => log('PASS ', clr('green', '✅ ' + m));
const FAIL  = m => log('FAIL ', clr('red', '❌ ' + m));
const WARN  = m => log('WARN ', clr('yellow', '⚠️  ' + m));
const HEAL  = m => log('HEAL ', clr('blue', '🔧 ' + m));
const ALERT = m => { log('ALERT', clr('magenta', '🚨 ' + m)); try { fs.appendFileSync(CFG.ALERT_LOG, `[${ts()}] ${m}\n`); } catch {} };

// ── STATE MANAGEMENT ─────────────────────────────────────────────
function loadState() {
  const s = readJSON(CFG.STATE_FILE);
  if (s) return s;
  return {
    fixes: {},           // { fixType: { attempts, successes, failures, timestamps:[], lastAttempt, lastSuccess } }
    checkerRuns: [],     // last 10 runs: { ts, issues, fixed, warns }
    escalations: [],     // { ts, reason, sent, body }
    healBudget: { used: 0, resetAt: nowISO() },
    supervisorHealth: { consecutiveCrashes: 0, lastRun: null, lastSuccess: null },
    stuckCounter: 0,
    lastClean: null,
  };
}

function saveState(state) {
  state.supervisorHealth.lastRun = nowISO();
  writeJSON(CFG.STATE_FILE, state);
}

// ── BAYESIAN CONFIDENCE ──────────────────────────────────────────
// P(fix_works) = (successes + 1) / (attempts + 2)  [Laplace smoothed]
function confidence(fixRecord) {
  if (!fixRecord) return 0.5; // uniform prior — no data
  const { attempts=0, successes=0 } = fixRecord;
  return (successes + 1) / (attempts + 2);
}

function recordAttempt(state, fixType, success) {
  if (!state.fixes[fixType]) {
    state.fixes[fixType] = { attempts:0, successes:0, failures:0, timestamps:[], lastAttempt:null, lastSuccess:null };
  }
  const f = state.fixes[fixType];
  f.attempts++;
  f.timestamps.push(now());
  f.timestamps = f.timestamps.filter(t => now()-t < 24*3600000); // keep 24h
  f.lastAttempt = nowISO();
  if (success) { f.successes++; f.lastSuccess = nowISO(); }
  else { f.failures++; }
}

// ── THRASH DETECTION (LAW 2) ─────────────────────────────────────
function isThrashing(state, fixType) {
  const f = state.fixes[fixType];
  if (!f) return false;
  const recentAttempts = (f.timestamps||[]).filter(t => now()-t < CFG.THRASH_WINDOW_MS).length;
  return recentAttempts >= CFG.THRASH_MAX;
}

// ── BUDGET CHECK (LAW 4) ─────────────────────────────────────────
function budgetAvailable(state) {
  const resetAt = new Date(state.healBudget.resetAt).getTime();
  if (now() - resetAt > 24*3600000) {
    state.healBudget = { used: 0, resetAt: nowISO() };
    return true;
  }
  return state.healBudget.used < CFG.SELF_HEAL_BUDGET;
}
function useBudget(state) { state.healBudget.used++; }

// ── CHECKER RUN HISTORY ───────────────────────────────────────────
function parseCheckerLog() {
  const logContent = readFile(CFG.CHECKER_LOG);
  const lines = logContent.split('\n').filter(Boolean);
  return lines.slice(-20).map(line => {
    const m = line.match(/\[(.+?)\] mode=(\S+) issues=(\d+) fixed=(\d+)/);
    if (!m) return null;
    return { ts: m[1], mode: m[2], issues: parseInt(m[3]), fixed: parseInt(m[4]) };
  }).filter(Boolean);
}

// ── STUCK DETECTION (LAW 5) ──────────────────────────────────────
function isStuck(runs) {
  if (runs.length < CFG.STUCK_RUNS) return false;
  const recent = runs.slice(-CFG.STUCK_RUNS);
  const allFull = recent.every(r => r.mode === 'all');
  if (!allFull) return false;
  const allSameIssues = recent.every(r => r.issues === recent[0].issues && r.issues > 0);
  const noneFixed = recent.every(r => r.fixed === 0);
  return allSameIssues && noneFixed;
}

// ── CHECKER HUNG DETECTION ────────────────────────────────────────
function isCheckerHung() {
  if (!fs.existsSync(CFG.LOCK_FILE)) return false;
  const lockAge = now() - fs.statSync(CFG.LOCK_FILE).mtimeMs;
  return lockAge > CFG.CHECKER_TIMEOUT;
}

// ── EMAIL ALERT VIA N8N WEBHOOK ───────────────────────────────────
async function sendAlert(state, subject, body, urgent=false) {
  const alertRecord = { ts: nowISO(), reason: subject, sent: false, body };

  INFO(`Sending alert: ${subject}`);

  // Build HTML email
  const html = `
<!DOCTYPE html><html><head><style>
body{font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:20px;color:#333}
h2{color:${urgent?'#c0392b':'#e67e22'};border-bottom:3px solid ${urgent?'#c0392b':'#e67e22'};padding-bottom:8px}
.badge{display:inline-block;padding:4px 12px;border-radius:12px;font-size:13px;font-weight:bold}
.urgent{background:#fdecea;color:#c0392b}.warn{background:#fef9e7;color:#d68910}
.section{background:#f8f9fa;border-left:4px solid ${urgent?'#c0392b':'#e67e22'};padding:12px;margin:12px 0;border-radius:4px}
.fix{background:#eafaf1;border-left:4px solid #27ae60;padding:8px 12px;margin:6px 0;border-radius:4px;font-size:13px}
pre{background:#2c3e50;color:#ecf0f1;padding:12px;border-radius:6px;font-size:12px;overflow-x:auto}
footer{font-size:11px;color:#aaa;border-top:1px solid #eee;padding-top:10px;margin-top:20px}
</style></head><body>
<h2>${urgent?'🚨':'⚠️'} Blixamo Supervisor Alert</h2>
<p><span class="badge ${urgent?'urgent':'warn'}">${urgent?'URGENT — ACTION REQUIRED':'WARNING'}</span>
&nbsp;&nbsp;<span style="color:#888;font-size:13px">${ts()} UTC</span></p>
<div class="section"><strong>${subject}</strong></div>
<pre>${body}</pre>
<h3>System Snapshot</h3>
<div class="section">
${getSystemSnapshot()}
</div>
<footer>
  Blixamo Bayesian Supervisor v1.0 &nbsp;·&nbsp; VPS 77.42.17.13<br>
  Self-heal budget used: ${state.healBudget.used}/${CFG.SELF_HEAL_BUDGET} in current 24h window<br>
  <a href="https://blixamo.com">blixamo.com</a> &nbsp;·&nbsp; 
  Run <code>node /var/www/blixamo/tools/blixamo-supervisor.js</code> for status
</footer>
</body></html>`;

  // Try n8n webhook first
  const webhookPayload = JSON.stringify({
    subject: `[Blixamo Supervisor] ${subject}`,
    html,
    to: CFG.ALERT_EMAIL,
    urgent,
  });

  const r = run(`curl -s -X POST ${CFG.N8N_WEBHOOK_URL} \
    -H "Content-Type: application/json" \
    -d '${webhookPayload.replace(/'/g, "'\\''")}' \
    --max-time 10 2>/dev/null`);

  if (r.ok && !r.out.includes('error')) {
    alertRecord.sent = true;
    ALERT(`Email sent: ${subject}`);
  } else {
    // Fallback: create n8n workflow trigger via API
    WARN(`Webhook failed, trying n8n API email trigger...`);
    const fallback = run(`curl -s -X POST http://localhost:5678/api/v1/workflows/KlYt3x88SxZa3LAY/execute \
      -H "Content-Type: application/json" \
      --max-time 10 2>/dev/null`);
    alertRecord.sent = fallback.ok;
    if (!fallback.ok) {
      WARN(`Email failed — alert written to ${CFG.ALERT_LOG} only`);
    }
  }

  state.escalations.push(alertRecord);
  if (state.escalations.length > 50) state.escalations = state.escalations.slice(-50);
  return alertRecord.sent;
}

function getSystemSnapshot() {
  const pm2 = run('pm2 jlist 2>/dev/null');
  let pm2Status = 'unknown';
  try {
    const list = JSON.parse(pm2.out);
    pm2Status = list.map(p => `${p.name}:${p.pm2_env?.status}`).join(' | ');
  } catch {}

  const mem    = run("free -m | awk 'NR==2{printf \"%d/%d MB (%.0f%%)\", $3,$2,$3/$2*100}'").out;
  const cpu    = run("cat /proc/loadavg | awk '{print $1}'").out;
  const disk   = run("df -h / | awk 'NR==2{print $5\" used, \"$4\" free\"}'").out;
  const docker = run("docker ps --format '{{.Names}}:{{.Status}}' 2>/dev/null | head -6").out.replace(/\n/g,'  ');
  const nginx  = run('systemctl is-active nginx').out;
  const watcher= run('systemctl is-active blixamo-watcher').out;

  return `PM2:     ${pm2Status}
RAM:     ${mem}
CPU:     load ${cpu}
Disk:    ${disk}
Docker:  ${docker}
Nginx:   ${nginx}
Watcher: ${watcher}`;
}

// ── SELF-HEAL ACTIONS ─────────────────────────────────────────────
const HEALS = {

  clearCheckerLock: {
    label: 'Clear hung checker lock',
    run: () => {
      run(`rm -f ${CFG.LOCK_FILE}`);
      // Kill any running checker process
      run('pkill -f "blixamo-checker.js" 2>/dev/null || true');
      return true;
    }
  },

  restartPm2: {
    label: 'Restart PM2 blixamo',
    run: () => run('pm2 restart blixamo').ok,
  },

  restartNginx: {
    label: 'Restart nginx',
    run: () => {
      const test = run('nginx -t 2>&1');
      if (!test.out.includes('ok')) return false;
      return run('systemctl restart nginx').ok;
    }
  },

  restartWatcher: {
    label: 'Restart blixamo-watcher',
    run: () => run('systemctl restart blixamo-watcher').ok,
  },

  restartN8n: {
    label: 'Restart n8n docker container',
    run: () => {
      run('docker restart n8n');
      const r = run('sleep 10 && curl -s -o /dev/null -w "%{http_code}" http://localhost:5678/healthz --max-time 8');
      return r.out === '200';
    }
  },

  restartRedis: {
    label: 'Restart Redis docker container',
    run: () => {
      run('docker restart redis');
      const r = run('sleep 5 && docker exec redis redis-cli ping 2>/dev/null');
      return r.out === 'PONG';
    }
  },

  cleanBuild: {
    label: 'Clean Next.js build (.next)',
    run: () => {
      run(`rm -rf ${CFG.BLIXAMO_DIR}/.next`);
      const b = run(`cd ${CFG.BLIXAMO_DIR} && npm run build 2>&1 | tail -3`, 120000);
      if (!b.ok || b.out.includes('error')) return false;
      return run('pm2 restart blixamo').ok;
    }
  },

  fixNginxCache: {
    label: 'Fix Cloudflare CDN-Cache-Control header',
    run: () => {
      const conf = fs.readFileSync('/etc/nginx/sites-enabled/blixamo', 'utf8');
      if (conf.includes('CDN-Cache-Control "no-store"')) return true;
      const fixed = conf.replace(
        /location \/ \{([^}]*?)proxy_pass http:\/\/localhost:3000;/,
        `location / {\n        proxy_hide_header Cache-Control;\n        add_header Cache-Control "public, s-maxage=0, must-revalidate";\n        add_header CDN-Cache-Control "no-store";\n$1proxy_pass http://localhost:3000;`
      );
      if (fixed === conf) return false;
      fs.writeFileSync('/etc/nginx/sites-enabled/blixamo', fixed);
      return run('nginx -t 2>&1').out.includes('ok') && run('systemctl reload nginx').ok;
    }
  },

  rebootVPS: {
    label: 'EMERGENCY VPS reboot',
    run: () => {
      ALERT('EMERGENCY REBOOT TRIGGERED — supervisor crash budget exhausted');
      run('shutdown -r +1 "Blixamo supervisor emergency reboot" 2>/dev/null || reboot &');
      return true;
    }
  },
};

// ── EVIDENCE → HYPOTHESIS MAP ────────────────────────────────────
// Maps observed symptoms to most likely heal action
function buildHypotheses(evidence) {
  const hyps = [];

  if (evidence.checkerHung) {
    hyps.push({ id: 'clearCheckerLock', label: 'Checker process hung', prior: 0.90 });
  }
  if (!evidence.pm2Online) {
    hyps.push({ id: 'restartPm2', label: 'PM2 blixamo down', prior: 0.95 });
  }
  if (evidence.nginxDown) {
    hyps.push({ id: 'restartNginx', label: 'Nginx down', prior: 0.90 });
  }
  if (!evidence.watcherActive) {
    hyps.push({ id: 'restartWatcher', label: 'Watcher service down', prior: 0.85 });
  }
  if (evidence.n8nDown) {
    hyps.push({ id: 'restartN8n', label: 'n8n container down', prior: 0.88 });
  }
  if (!evidence.redisPong) {
    hyps.push({ id: 'restartRedis', label: 'Redis not responding', prior: 0.85 });
  }
  if (evidence.buildMissing) {
    hyps.push({ id: 'cleanBuild', label: 'Next.js build broken', prior: 0.80 });
  }
  if (evidence.cacheMissing) {
    hyps.push({ id: 'fixNginxCache', label: 'CDN cache header missing', prior: 0.75 });
  }
  if (evidence.stuck) {
    // Checker keeps running but can't fix — likely build issue
    hyps.push({ id: 'cleanBuild', label: 'System stuck despite fixes', prior: 0.60 });
  }

  return hyps;
}

// ── COLLECT EVIDENCE ──────────────────────────────────────────────
function collectEvidence(state) {
  INFO('Collecting evidence...');

  let pm2Online = false;
  try {
    const list = JSON.parse(run('pm2 jlist 2>/dev/null').out);
    pm2Online = list.find(p=>p.name==='blixamo')?.pm2_env?.status === 'online';
  } catch {}

  const n8nHealth  = run('curl -s -o /dev/null -w "%{http_code}" http://localhost:5678/healthz --max-time 5');
  const redisPing  = run('docker exec redis redis-cli ping 2>/dev/null');
  const nginxAct   = run('systemctl is-active nginx');
  const watcherAct = run('systemctl is-active blixamo-watcher');
  const cacheHdr   = run('curl -sI https://blixamo.com/ 2>/dev/null | grep -i "cdn-cache-control"');
  const buildOk    = fs.existsSync(`${CFG.BLIXAMO_DIR}/.next/required-server-files.json`);

  const checkerRuns = parseCheckerLog();
  // Update state with latest checker runs
  state.checkerRuns = checkerRuns;

  return {
    pm2Online,
    n8nDown:      n8nHealth.out !== '200',
    redisPong:    redisPing.out === 'PONG',
    nginxDown:    nginxAct.out  !== 'active',
    watcherActive:watcherAct.out === 'active',
    buildMissing: !buildOk,
    cacheMissing: !cacheHdr.out.toLowerCase().includes('no-store'),
    checkerHung:  isCheckerHung(),
    stuck:        isStuck(checkerRuns),
    checkerRuns,
  };
}

// ════════════════════════════════════════════════════════════════
//  MAIN SUPERVISOR LOOP
// ════════════════════════════════════════════════════════════════
async function supervise() {
  const state = loadState();

  console.log('\n' + clr('cyan','█').repeat(60));
  console.log(clr('bold',` BLIXAMO BAYESIAN SUPERVISOR — ${ts()}`));
  console.log(clr('gray', ` Budget: ${state.healBudget.used}/${CFG.SELF_HEAL_BUDGET} heals used | Crashes: ${state.supervisorHealth.consecutiveCrashes}`));
  console.log(clr('cyan','█').repeat(60));

  // ── LAW 6: supervisor crash guard ────────────────────────────
  state.supervisorHealth.consecutiveCrashes = state.supervisorHealth.consecutiveCrashes || 0;
  if (state.supervisorHealth.consecutiveCrashes >= CFG.SUPERVISOR_CRASH_MAX) {
    ALERT('Supervisor crashed 3 consecutive times — triggering emergency VPS reboot');
    await sendAlert(state, '🚨 EMERGENCY: Supervisor crash loop detected',
      `Supervisor has crashed ${CFG.SUPERVISOR_CRASH_MAX} times in a row.\nTriggering VPS reboot as last resort.\nCheck /var/log/blixamo-supervisor.log`, true);
    HEALS.rebootVPS.run();
    saveState(state);
    process.exit(1);
  }

  // ── COLLECT EVIDENCE ─────────────────────────────────────────
  const evidence = collectEvidence(state);

  // ── PRINT SYSTEM SNAPSHOT ────────────────────────────────────
  console.log(`\n${clr('gray','─'.repeat(58))}`);
  console.log(` System snapshot:`);
  PASS(`PM2 blixamo: ${evidence.pm2Online ? 'online' : 'DOWN'}`);
  evidence.n8nDown    ? FAIL('n8n: DOWN')           : PASS('n8n: healthy');
  evidence.redisPong  ? PASS('Redis: PONG')          : FAIL('Redis: not responding');
  evidence.nginxDown  ? FAIL('Nginx: DOWN')          : PASS('Nginx: active');
  evidence.watcherActive ? PASS('Watcher: active')   : FAIL('Watcher: DOWN');
  evidence.buildMissing  ? FAIL('.next: MISSING')    : PASS('.next build: present');
  evidence.cacheMissing  ? WARN('CDN cache: missing no-store') : PASS('CDN cache: safe');
  evidence.checkerHung   ? WARN('Checker: HUNG')     : PASS('Checker: not hung');
  evidence.stuck         ? WARN('System: STUCK (same issues, no fixes)') : PASS('Checker: making progress');
  console.log(clr('gray','─'.repeat(58)));

  // ── BUILD HYPOTHESIS TABLE ────────────────────────────────────
  const hyps = buildHypotheses(evidence);

  if (hyps.length === 0) {
    PASS('All systems nominal — nothing to heal');
    state.supervisorHealth.consecutiveCrashes = 0;
    state.supervisorHealth.lastSuccess = nowISO();
    if (evidence.stuck === false) state.stuckCounter = 0;
    saveState(state);

    // Still log healthy status
    INFO(`Checker runs in log: ${evidence.checkerRuns.length}`);
    if (evidence.checkerRuns.length > 0) {
      const last = evidence.checkerRuns[evidence.checkerRuns.length-1];
      INFO(`Last checker: issues=${last.issues} fixed=${last.fixed} at ${last.ts}`);
    }
    return;
  }

  // ── STUCK ESCALATION (LAW 5) ─────────────────────────────────
  if (evidence.stuck) {
    state.stuckCounter = (state.stuckCounter||0) + 1;
    if (state.stuckCounter >= CFG.STUCK_RUNS) {
      ALERT(`System stuck for ${state.stuckCounter} consecutive runs — escalating`);
      const stuckDetail = evidence.checkerRuns.slice(-5).map(r =>
        `  [${r.ts}] issues=${r.issues} fixed=${r.fixed}`).join('\n');
      await sendAlert(state,
        `System stuck — ${evidence.checkerRuns.slice(-1)[0]?.issues||'?'} issues not resolving`,
        `Checker has run ${state.stuckCounter} times with same issue count and zero fixes.\n\nRecent runs:\n${stuckDetail}\n\nManual investigation required.\nSSH: root@77.42.17.13\nLog: tail -50 /var/log/blixamo-checker.log`,
        true
      );
      saveState(state);
      return; // Stop — escalated
    }
  } else {
    state.stuckCounter = 0;
  }

  // ── PROCESS HYPOTHESES ───────────────────────────────────────
  console.log(`\n  ${hyps.length} issue(s) detected. Running Bayesian heal loop...\n`);

  let healsThisRun = 0;

  for (const hyp of hyps) {
    const fixRecord = state.fixes[hyp.id];
    const conf = confidence(fixRecord);
    const thrash = isThrashing(state, hyp.id);
    const budget = budgetAvailable(state);

    console.log(`  ${clr('yellow','▶')} [${hyp.label}]`);
    console.log(`    P(fix_works) = ${conf.toFixed(2)} | thrashing=${thrash} | budget=${budget?state.healBudget.used+'/'+CFG.SELF_HEAL_BUDGET:'EXHAUSTED'}`);

    // ── LAW 3: confidence gate ──────────────────────────────
    if (conf < CFG.MIN_CONFIDENCE) {
      WARN(`  P=${conf.toFixed(2)} < ${CFG.MIN_CONFIDENCE} — confidence too low, escalating`);
      await sendAlert(state,
        `Low confidence on fix: ${hyp.label}`,
        `Fix "${hyp.label}" has been attempted multiple times with low success rate.\nP(fix_works) = ${conf.toFixed(2)} (threshold: ${CFG.MIN_CONFIDENCE})\nHistory: attempts=${fixRecord?.attempts||0} successes=${fixRecord?.successes||0} failures=${fixRecord?.failures||0}\n\nManual intervention required.`,
        true
      );
      continue;
    }

    // ── LAW 2: thrash gate ──────────────────────────────────
    if (thrash) {
      WARN(`  Thrash detected: same fix attempted ${CFG.THRASH_MAX}+ times in ${CFG.THRASH_WINDOW_MS/3600000}h — skipping`);
      await sendAlert(state,
        `Thrash loop: ${hyp.label}`,
        `Fix "${hyp.label}" has been attempted ${CFG.THRASH_MAX} times in ${CFG.THRASH_WINDOW_MS/3600000}h window without resolving.\nThis is a thrash loop.\n\nSystem snapshot:\n${getSystemSnapshot()}\n\nManual intervention required.`,
        true
      );
      continue;
    }

    // ── LAW 4: budget gate ──────────────────────────────────
    if (!budget) {
      WARN(`  Self-heal budget exhausted (${CFG.SELF_HEAL_BUDGET}/24h) — escalating`);
      await sendAlert(state,
        `Self-heal budget exhausted`,
        `Supervisor has used all ${CFG.SELF_HEAL_BUDGET} self-heal attempts in the current 24h window.\nCannot auto-heal: ${hyp.label}\n\nSystem snapshot:\n${getSystemSnapshot()}\n\nManual intervention required.`,
        true
      );
      break;
    }

    // ── APPLY HEAL ───────────────────────────────────────────
    HEAL(`Attempting: ${hyp.label}`);
    useBudget(state);
    healsThisRun++;

    const healFn = HEALS[hyp.id];
    if (!healFn) { WARN(`No heal function for ${hyp.id}`); continue; }

    let success = false;
    try {
      success = await healFn.run();
    } catch(e) {
      FAIL(`Heal threw: ${e.message}`);
    }

    recordAttempt(state, hyp.id, success);

    if (success) {
      PASS(`Healed: ${hyp.label} (P now ${confidence(state.fixes[hyp.id]).toFixed(2)})`);
    } else {
      FAIL(`Heal failed: ${hyp.label} (P now ${confidence(state.fixes[hyp.id]).toFixed(2)})`);
      // Immediate notification for failed heal
      await sendAlert(state,
        `Heal failed: ${hyp.label}`,
        `Attempted to auto-heal "${hyp.label}" but the fix did not succeed.\nP(fix_works) after attempt: ${confidence(state.fixes[hyp.id]).toFixed(2)}\n\nSystem snapshot:\n${getSystemSnapshot()}`,
        false
      );
    }
  }

  // ── SAVE STATE + MARK SUCCESS ────────────────────────────────
  state.supervisorHealth.consecutiveCrashes = 0;
  state.supervisorHealth.lastSuccess = nowISO();

  // Print final posterior table
  if (Object.keys(state.fixes).length > 0) {
    console.log(`\n  Fix confidence history:`);
    console.log(`  ${'─'.repeat(54)}`);
    for (const [id, f] of Object.entries(state.fixes)) {
      const p = confidence(f).toFixed(2);
      const bar = '█'.repeat(Math.round(confidence(f)*10));
      const col = confidence(f)>0.6?'green':confidence(f)>0.3?'yellow':'red';
      console.log(`  ${clr(col, p)} ${clr(col,bar.padEnd(10))} ${id} (${f.attempts}att ${f.successes}ok ${f.failures}fail)`);
    }
  }

  saveState(state);
  console.log(`\n${clr('cyan','═').repeat(60)}`);
  console.log(clr('bold',` Budget used: ${state.healBudget.used}/${CFG.SELF_HEAL_BUDGET} | Heals this run: ${healsThisRun}`));
  console.log(clr('cyan','═').repeat(60)+'\n');
}

// ── ENTRY POINT ──────────────────────────────────────────────────
// Wrap in crash handler to track consecutive crashes (LAW 6)
async function main() {
  const state = loadState();
  try {
    await supervise();
  } catch(e) {
    state.supervisorHealth.consecutiveCrashes = (state.supervisorHealth.consecutiveCrashes||0) + 1;
    FAIL(`Supervisor crash #${state.supervisorHealth.consecutiveCrashes}: ${e.message}`);
    try { fs.appendFileSync(CFG.SUPERVISOR_LOG, `[${ts()}] CRASH: ${e.stack}\n`); } catch {}
    saveState(state);
    process.exit(1);
  }
}

main();
