export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  appPort: parseInt(process.env.APP_PORT, 10) || 8000,
  appName: process.env.APP_NAME || 'App',
  appUrl: process.env.APP_URL || 'https://example.com',
  logLevel: process.env.LOG_LEVEL || 'info',
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60000,
    limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 60,
  },
});
