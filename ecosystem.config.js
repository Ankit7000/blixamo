module.exports = {
  apps: [{
    name: 'blixamo',
    script: '/usr/bin/npm',
    args: 'start',
    cwd: '/var/www/blixamo',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    // Structured logging
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: '/home/bot/.pm2/logs/blixamo-error.log',
    out_file: '/home/bot/.pm2/logs/blixamo-out.log',
    merge_logs: true,
  }],
}
