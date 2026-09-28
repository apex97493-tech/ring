module.exports = {
  apps: [
    {
      name: 'forever-jewell-studio',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 'max', // Utilizes all CPU cores on Hostinger VPS
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1024M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
