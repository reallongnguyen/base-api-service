export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  app: {
    name: process.env.APP_NAME || 'App',
    port: parseInt(process.env.APP_PORT, 10) || 8000,
    url: process.env.APP_URL || 'https://example.com',
  },
  logLevel: process.env.LOG_LEVEL || 'info',
  security: {
    jwtSecret: process.env.JWT_SECRET || '',
    throttle: {
      ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60000,
      limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 60,
    },
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379/0',
  },
});
