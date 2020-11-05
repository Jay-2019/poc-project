module.exports = {
  apps: [
    {
      name: "poc-project",
      script: "./server.js",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "development",
        // DB: "mongodb://127.0.0.1:27017/poc-project",
        // REDIS_URL: "redis://127.0.0.1:6379",
        // PORT: 6379,
      },
    },
  ],

  // deploy: {
  //   production: {
  //     user: "SSH_USERNAME",
  //     host: "SSH_HOSTMACHINE",
  //     ref: "origin/master",
  //     repo: "GIT_REPOSITORY",
  //     path: "DESTINATION_PATH",
  //     "pre-deploy-local": "",
  //     "post-deploy":
  //       "npm install && pm2 reload ecosystem.config.js --env production",
  //     "pre-setup": "",
  //   },
  // },
};
