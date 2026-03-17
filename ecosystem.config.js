module.exports = {
  apps: [{
    name: 'blixamo',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/blixamo',
    // 'max' uses all CPU cores — change to a number (e.g. 2) if you want to limit
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    // Zero-downtime deploy: use `pm2 reload blixamo` after code changes
    wait_ready: true,
    listen_timeout: 10000,
    kill_timeout: 5000,
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    // Structured logging
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: '/var/log/pm2/blixamo-error.log',
    out_file: '/var/log/pm2/blixamo-out.log',
    merge_logs: true,
  }],
}
