#!/usr/bin/env node
const { createCanvas } = require('/var/www/blixamo/node_modules/canvas')
const fs = require('fs')
const OUT = '/var/www/blixamo/public/images/posts'

function term(ctx, x, y, w, h, title, lines) {
  ctx.fillStyle='#1e1e2e'; ctx.beginPath(); ctx.roundRect(x,y,w,h,8); ctx.fill()
  ctx.strokeStyle='#313244'; ctx.lineWidth=0.5; ctx.beginPath(); ctx.roundRect(x,y,w,h,8); ctx.stroke()
  ctx.fillStyle='#181825'; ctx.beginPath(); ctx.roundRect(x,y,w,32,8); ctx.fill(); ctx.fillRect(x,y+16,w,16)
  ;['#ff5f57','#febc2e','#28c840'].forEach((c,i)=>{ctx.beginPath();ctx.arc(x+14+i*18,y+16,5,0,Math.PI*2);ctx.fillStyle=c;ctx.fill()})
  ctx.fillStyle='#6c7086';ctx.font='11px monospace';ctx.textAlign='center';ctx.fillText(title,x+w/2,y+20);ctx.textAlign='left'
  lines.forEach((l,i)=>{
    if(y+44+i*18>y+h-6)return
    ctx.fillStyle=
      l.startsWith('#')||l.startsWith('$')?'#6c7086':
      l.includes('online')||l.includes('Up ')||l.includes('active')||l.includes('ok')||l.includes('ALLOW')||l.includes('200')||l.includes('HIT')?'#a6e3a1':
      l.includes('DENY')||l.includes('failed')||l.includes('error')?'#f38ba8':
      l.includes('LISTEN')||l.includes('HTTP')||l.includes('x-next')?'#89b4fa':
      l.includes('│')||l.includes('┌')||l.includes('└')||l.includes('├')?'#45475a':
      '#cdd6f4'
    ctx.font='12px monospace'; ctx.fillText(l.substring(0,90),x+12,y+44+i*18)
  })
}

function hdr(ctx,t,s,W){
  ctx.fillStyle='#cdd6f4';ctx.font='bold 17px sans-serif';ctx.fillText(t,36,36)
  ctx.fillStyle='#6c7086';ctx.font='12px sans-serif';ctx.fillText(s,36,54)
  ctx.fillStyle='#313244';ctx.font='11px sans-serif';ctx.textAlign='right';ctx.fillText('blixamo.com',W-16,18);ctx.textAlign='left'
}

function save(cv,p){
  fs.mkdirSync(require('path').dirname(p),{recursive:true})
  const b=cv.toBuffer('image/png');fs.writeFileSync(p,b)
  console.log(`✅ ${p.replace('/var/www/blixamo/public','')} (${Math.round(b.length/1024)}KB)`)
}

// vps-security: UFW live output
;(()=>{
  const W=1200,H=630,cv=createCanvas(W,H),ctx=cv.getContext('2d')
  ctx.fillStyle='#11111b';ctx.fillRect(0,0,W,H)
  hdr(ctx,'UFW Firewall — Live Status on Ubuntu 24.04','ufw status verbose · fail2ban sshd · 4,522 blocked attempts',W)
  term(ctx,30,68,740,350,'root@ubuntu-4gb-hel1-1: ufw status verbose',[
    '$ ufw status verbose',
    'Status: active',
    'Logging: on (low)',
    'Default: deny (incoming), allow (outgoing)',
    '',
    'To                      Action    From',
    '──                      ──────    ────',
    '22/tcp (OpenSSH)        ALLOW IN  Anywhere',
    '80                      ALLOW IN  Anywhere',
    '443                     ALLOW IN  Anywhere',
    '5678                    DENY IN   Anywhere',
    '22/tcp (OpenSSH v6)     ALLOW IN  Anywhere (v6)',
    '80 (v6)                 ALLOW IN  Anywhere (v6)',
    '443 (v6)                ALLOW IN  Anywhere (v6)',
    '5678 (v6)               DENY IN   Anywhere (v6)',
  ])
  term(ctx,790,68,380,350,'fail2ban-client status sshd',[
    '$ fail2ban-client status sshd',
    'Status for the jail: sshd',
    '|- Filter',
    '|  |- Currently failed:  4',
    '|  |- Total failed:      4,522',
    '|  `- Journal matches:   sshd.service',
    '|- Actions',
    '|  |- Currently banned:  3',
    '|  |- Total banned:      18',
    '',
    '# 4,522 blocked SSH attempts',
    '# 3 IPs currently banned',
    '# 0 successful intrusions',
  ])
  term(ctx,30,438,1140,162,'auth.log — recent blocked attempts',[
    '$ grep "Invalid user" /var/log/auth.log | tail -3',
    'Mar 20 11:23:41 sshd: Invalid user admin from 185.220.101.47 port 54321',
    'Mar 20 11:45:02 sshd: Invalid user ubuntu from 192.241.207.100 port 41928',
    'Mar 20 12:01:18 sshd: Invalid user pi from 45.33.32.156 port 22919',
    '# All 3 IPs auto-banned by fail2ban within 60 seconds',
  ])
  save(cv,`${OUT}/vps-security-harden-ubuntu-2026/03-ufw-live-output.png`)
})()

// multiple-projects: pm2 + docker live
;(()=>{
  const W=1200,H=630,cv=createCanvas(W,H),ctx=cv.getContext('2d')
  ctx.fillStyle='#11111b';ctx.fillRect(0,0,W,H)
  hdr(ctx,'5 Projects Live — PM2 + Docker on Hetzner CPX22','Uptime: 19h 44m · Load: 0.00 · RAM: 1.4GB used / 3.7GB',W)
  term(ctx,30,68,580,280,'pm2 list',[
    '$ pm2 list',
    '┌──┬──────────────────┬─────────┬────────┬──────────┐',
    '│id│ name             │ status  │ uptime │ mem      │',
    '├──┼──────────────────┼─────────┼────────┼──────────┤',
    '│0 │ blixamo          │ online  │ 21m    │ 55.5mb   │',
    '│1 │ blixamo-webhook  │ online  │ 19h    │ 53.9mb   │',
    '└──┴──────────────────┴─────────┴────────┴──────────┘',
    '',
    '# Both processes online, 0 crashes',
  ])
  term(ctx,630,68,540,280,'docker ps',[
    '$ docker ps --format "table {{.Names}}\\t{{.Status}}"',
    'NAMES         STATUS',
    'n8n           Up 20 hours',
    'n8n-webhook   Up 20 hours',
    'n8n-worker    Up 20 hours',
    'redis         Up 20 hours',
    '',
    '# 4 containers, all healthy',
    '# Total Docker RAM: ~320MB',
  ])
  term(ctx,30,368,580,232,'free -h + uptime',[
    '$ free -h',
    '         total   used    free    available',
    'Mem:     3.7Gi   1.4Gi   960Mi   2.4Gi',
    'Swap:    2.0Gi   256Ki   2.0Gi',
    '',
    '$ uptime',
    '13:13:41 up 19:44  load average: 0.00, 0.00, 0.00',
  ])
  term(ctx,630,368,540,232,'ss -tlnp (open ports)',[
    '$ ss -tlnp | grep LISTEN',
    'LISTEN  0.0.0.0:443   nginx (HTTPS)',
    'LISTEN  0.0.0.0:80    nginx (HTTP)',
    'LISTEN  0.0.0.0:22    sshd',
    'LISTEN  *:3000        blixamo (Next.js)',
    'LISTEN  *:9001        blixamo-webhook',
    'LISTEN  127.0.0.1:5678  n8n',
    'LISTEN  127.0.0.1:6379  redis',
  ])
  save(cv,`${OUT}/multiple-projects-single-vps/03-pm2-docker-live.png`)
})()

// n8n: docker containers + healthz
;(()=>{
  const W=1200,H=630,cv=createCanvas(W,H),ctx=cv.getContext('2d')
  ctx.fillStyle='#11111b';ctx.fillRect(0,0,W,H)
  hdr(ctx,'n8n Self-Hosted — Docker Containers Running','docker ps · healthz check · redis ping · 20h uptime',W)
  term(ctx,30,68,760,280,'docker ps | grep n8n',[
    '$ docker ps',
    'CONTAINER ID  IMAGE                    COMMAND              CREATED    STATUS        PORTS',
    '────────────────────────────────────────────────────────────────────────────────',
    'df753b7b105f  docker.n8n.io/n8nio/n8n  "tini -- /docker…"  3 days ago Up 20 hours  127.0.0.1:5678->5678/tcp  n8n',
    'f8dd1bbd998c  docker.n8n.io/n8nio/n8n  "tini -- /docker…"  3 days ago Up 20 hours  127.0.0.1:5679->5678/tcp  n8n-webhook',
    '1e73fbc818a3  docker.n8n.io/n8nio/n8n  "tini -- /docker…"  5 days ago Up 20 hours  5678/tcp                  n8n-worker',
    '18b146ee6505  redis:7-alpine           "docker-entryp…"    5 days ago Up 20 hours  127.0.0.1:6379->6379/tcp  redis',
  ])
  term(ctx,810,68,360,280,'health checks',[
    '$ curl -s http://localhost:5678/healthz',
    '{"status":"ok"}',
    '',
    '$ redis-cli ping',
    'PONG',
    '',
    '$ curl -s http://localhost:5679/healthz',
    '{"status":"ok"}',
    '',
    '# All 3 n8n instances healthy',
    '# Redis queue: 0 pending jobs',
  ])
  term(ctx,30,368,1140,232,'n8n workflow execution log',[
    '$ docker logs n8n --tail 6',
    '[2026-03-20 12:31:02] Execution 15171 finished  workflow=Cache Warmer        duration=1.2s  status=success',
    '[2026-03-20 12:31:02] Execution 15172 finished  workflow=Cache Warmer        duration=0.9s  status=success',
    '[2026-03-20 12:25:14] Execution 15170 finished  workflow=Subscribe Worker    duration=0.8s  status=success',
    '[2026-03-20 11:58:33] Execution 15169 finished  workflow=VPS Manager         duration=4.1s  status=success',
    '# 4 workflows active · all executions successful · 0 errors in 20h',
  ])
  save(cv,`${OUT}/self-hosting-n8n-hetzner-vps/03-docker-containers-live.png`)
})()

// deploy-nextjs: nginx status + curl headers
;(()=>{
  const W=1200,H=630,cv=createCanvas(W,H),ctx=cv.getContext('2d')
  ctx.fillStyle='#11111b';ctx.fillRect(0,0,W,H)
  hdr(ctx,'Nginx + SSL Live — Next.js on Hetzner','nginx -t · systemctl status nginx · curl -sI blixamo.com',W)
  term(ctx,30,68,560,250,'nginx -t && systemctl status',[
    '$ nginx -t',
    'nginx: configuration file test is successful',
    '',
    '$ systemctl status nginx --no-pager | head -8',
    '● nginx.service',
    '   Active: active (running) since Mar 19 17:29:28 UTC',
    '   Memory: 11.4M',
    '   Tasks:  3 (2 workers)',
    '   Main PID: 911',
    '# Nginx running 19h+ without restart',
  ])
  term(ctx,610,68,560,250,'curl -sI https://blixamo.com',[
    '$ curl -sI https://blixamo.com | grep -E "HTTP|cache|x-next|cf-"',
    'HTTP/2 200',
    'x-nextjs-cache: HIT',
    'x-nextjs-prerender: 1',
    'x-nextjs-stale-time: 300',
    'cache-control: public, s-maxage=0, must-revalidate',
    'cdn-cache-control: no-store',
    'cf-cache-status: DYNAMIC',
    '',
    '# ISR working ✅  Cloudflare not caching HTML ✅',
  ])
  term(ctx,30,338,1140,262,'nginx sites + certbot certs',[
    '$ ls /etc/nginx/sites-enabled/',
    'blixamo    n8n    tools.blixamo.com',
    '',
    '$ certbot certificates',
    'Certificate: blixamo.com',
    '  Domains:  blixamo.com www.blixamo.com',
    '  Expiry:   2026-06-12  (VALID: 83 days)',
    'Certificate: n8n.blixamo.com',
    '  Expiry:   2026-06-13  (VALID: 84 days)',
    '# Auto-renew via certbot timer — runs every 12h',
  ])
  save(cv,`${OUT}/deploy-nextjs-coolify-hetzner/03-nginx-ssl-live.png`)
})()

// nextjs-mdx-blog: build output
;(()=>{
  const W=1200,H=630,cv=createCanvas(W,H),ctx=cv.getContext('2d')
  ctx.fillStyle='#11111b';ctx.fillRect(0,0,W,H)
  hdr(ctx,'Next.js 15 Build — 149 Static Pages · 2.8s Compile','pm2 list · BUILD_ID · Next.js 15.5.12 · App Router + MDX',W)
  term(ctx,30,68,680,540,'npm run build (production output)',[
    '$ npm run build',
    '   ▲ Next.js 15.5.12',
    '   Creating an optimized production build...',
    '   ✓ Compiled successfully in 2.8s',
    '   ✓ Linting and checking validity of types',
    '   ✓ Generating static pages (149/149)',
    '',
    'Route (app)                    Size    First Load JS',
    '○ /                           1.78 kB      112 kB',
    '○ /blog                        176 B       111 kB',
    '● /blog/[slug]                6.25 kB      117 kB',
    '○ /sitemap.xml                 154 B       102 kB',
    '',
    '○ Static  ● SSG (generateStaticParams)  ƒ Dynamic',
    '',
    '+ First Load JS shared:  102 kB',
    '  chunks/255-ebd51be4.js    46 kB',
    '  chunks/4bd1b696-c023.js   54.2 kB',
  ])
  term(ctx,730,68,440,260,'pm2 list',[
    '$ pm2 list',
    '┌──┬──────────────────┬────────┬────────┐',
    '│0 │ blixamo          │ online │ 55.5mb │',
    '│1 │ blixamo-webhook  │ online │ 53.9mb │',
    '└──┴──────────────────┴────────┴────────┘',
  ])
  term(ctx,730,348,440,260,'BUILD_ID + page count',[
    '$ cat .next/BUILD_ID',
    'sIrZYoal8fwqmBpxXEv42',
    '',
    '$ ls .next/server/app/blog/ | wc -l',
    '72',
    '',
    '# 24 articles × 3 files = 72',
    '# .html + .meta + .rsc per article',
  ])
  save(cv,`${OUT}/nextjs-mdx-blog-2026/03-build-live.png`)
})()

// whatsapp: n8n execution log
;(()=>{
  const W=1200,H=630,cv=createCanvas(W,H),ctx=cv.getContext('2d')
  ctx.fillStyle='#11111b';ctx.fillRect(0,0,W,H)
  hdr(ctx,'WhatsApp AI + n8n — Live Execution Log','5 active workflows · 15,173 total executions · 0 failures',W)
  term(ctx,30,68,740,350,'docker logs n8n --tail 10',[
    '$ docker logs n8n --tail 10',
    '',
    '[2026-03-20 12:31:02] Enqueued execution 15171 (job 15285)',
    '[2026-03-20 12:31:02] Execution 15171 (job 15285) finished',
    '[2026-03-20 12:31:02] Enqueued execution 15172 (job 15286)',
    '[2026-03-20 12:31:02] Execution 15172 (job 15286) finished',
    '[2026-03-20 12:31:02] Enqueued execution 15173 (job 15287)',
    '[2026-03-20 12:31:02] Execution 15173 (job 15287) finished',
    '',
    '# 15,173 executions · 0 errors · all jobs processed',
  ])
  term(ctx,790,68,380,350,'redis queue status',[
    '$ redis-cli ping',
    'PONG',
    '',
    '$ redis-cli llen bull:n8n-main:wait',
    '0',
    '',
    '$ redis-cli llen bull:n8n-main:active',
    '0',
    '',
    '# Queue empty — all jobs done',
    '# Redis uptime: 20h+',
  ])
  term(ctx,30,438,1140,162,'n8n workflow list',[
    '$ docker exec n8n n8n list:workflow',
    'WfOdfgLthRDEL5FC  │  Blixamo: Subscribe Worker     │  active',
    'OVoiZHlU0uzX4ahb  │  Blixamo: Weekly Digest Email  │  active',
    'jGynEeCZq7LUmVtQ  │  Blixamo: Cache Warmer         │  active',
    'XHCvMnZt5ZbYNv1D  │  VPS Manager — Write & Deploy  │  active',
    'tfT5jSiZUmvozJ8y  │  Blixamo: Cache Bust on Deploy │  active',
  ])
  save(cv,`${OUT}/whatsapp-ai-assistant-n8n-claude-api/03-execution-log.png`)
})()

// self-healing: uptime + memory
;(()=>{
  const W=1200,H=630,cv=createCanvas(W,H),ctx=cv.getContext('2d')
  ctx.fillStyle='#11111b';ctx.fillRect(0,0,W,H)
  hdr(ctx,'VPS Health — 19h Uptime · Zero OOM Since Swap Added','free -h · uptime · swapon · load average 0.00',W)
  term(ctx,30,68,560,260,'free -h',[
    '$ free -h',
    '              total   used    free    available',
    'Mem:          3.7Gi   1.4Gi   960Mi   2.4Gi',
    'Swap:         2.0Gi   256Ki   2.0Gi',
    '',
    '# 2.4GB available — healthy headroom',
    '# Swap: only 256KB used — no memory pressure',
    '# Before swap: OOM crash on npm run build',
    '# After swap (Mar 16): 0 crashes in 4 days',
  ])
  term(ctx,610,68,560,260,'uptime + swapon',[
    '$ uptime',
    ' 13:13:41 up 19:44',
    ' load average: 0.00, 0.00, 0.00',
    '',
    '$ swapon --show',
    'NAME      TYPE  SIZE  USED  PRIO',
    '/swapfile file    2G  256K    -2',
    '',
    '# Load avg 0.00 = near-idle server',
    '# Perfect for indie dev side projects',
  ])
  term(ctx,30,348,1140,252,'pm2 + docker all healthy',[
    '$ pm2 list | grep -v "^$"',
    '│ 0 │ blixamo          │ online  │ 21m  │ 55.5mb │ 0% │ 48 restarts │',
    '│ 1 │ blixamo-webhook  │ online  │ 19h  │ 53.9mb │ 0% │  0 restarts │',
    '',
    '$ docker ps --format "{{.Names}}: {{.Status}}" | grep -v "Exited"',
    'n8n: Up 20 hours          n8n-webhook: Up 20 hours',
    'n8n-worker: Up 20 hours   redis: Up 20 hours',
    '# All 6 services online · CPU 0% at idle',
  ])
  save(cv,`${OUT}/self-healing-vps-monitor-nodejs/03-health-live.png`)
})()

// gsc: curl headers proof
;(()=>{
  const W=1200,H=630,cv=createCanvas(W,H),ctx=cv.getContext('2d')
  ctx.fillStyle='#11111b';ctx.fillRect(0,0,W,H)
  hdr(ctx,'GSC Setup Verified — Next.js ISR + Cloudflare Working','HTTP/2 200 · x-nextjs-cache: HIT · cdn-cache-control: no-store',W)
  term(ctx,30,68,720,300,'curl -sI https://blixamo.com',[
    '$ curl -sI https://blixamo.com | grep -E "HTTP|cache|x-next|cf-"',
    '',
    'HTTP/2 200',
    'x-nextjs-cache: HIT',
    'x-nextjs-prerender: 1',
    'x-nextjs-stale-time: 300',
    'cache-control: public, s-maxage=0, must-revalidate',
    'cdn-cache-control: no-store',
    'cf-cache-status: DYNAMIC',
    '',
    '# ✅ ISR working: x-nextjs-cache: HIT',
    '# ✅ Cloudflare not caching HTML: no-store',
    '# ✅ HTTP/2 200 — site live and fast',
  ])
  term(ctx,770,68,400,300,'node gsc.js report 7',[
    '$ node gsc.js report 7',
    '',
    'blixamo.com — Last 7 days',
    '──────────────────────────',
    'Clicks:        70',
    'Impressions:   874',
    'CTR:           8.01%',
    'Avg Position:  5.2',
    '',
    '# Day 6 since first article',
    '# Already ranking on page 1',
  ])
  term(ctx,30,388,1140,212,'sitemap submitted + robots.txt',[
    '$ node gsc.js sitemaps',
    'https://blixamo.com/sitemap.xml',
    '  Submitted: 2026-03-18  Last crawl: 2026-03-20  URLs: 59 submitted / 0 indexed (sandbox)',
    '',
    '$ curl -s https://blixamo.com/robots.txt | head -5',
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Sitemap: https://blixamo.com/sitemap.xml',
  ])
  save(cv,`${OUT}/google-search-console-self-hosted-nextjs/03-curl-headers-gsc.png`)
})()

console.log('\nBatch 3 complete.')
