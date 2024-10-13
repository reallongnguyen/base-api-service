export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  app: {
    name: process.env.APP_NAME || 'App',
    port: parseInt(process.env.APP_PORT, 10) || 8000,
    url: process.env.APP_URL || 'https://example.com',
  },
  logLevel: process.env.LOG_LEVEL || 'info',
  security: {
    shouldVerifyToken:
      String(process.env.VERIFY_TOKEN).toLowerCase() === 'true',
    jwtSecret: process.env.JWT_SECRET || '',
    throttle: {
      ttl: parseInt(process.env.THROTTLE_TTL, 10) || 1,
      limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 10000,
    },
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379/0',
  },
  gcp: {
    bucket: {
      userAsset: process.env.USER_ASSET_BUCKET || 'base101-dev01-user-asset',
    },
  },
  mutex: {
    redis1: {
      host: process.env.MUTEX_REDIS1_HOST || 'localhost',
      port: parseInt(process.env.MUTEX_REDIS1_PORT, 10) || 6379,
    },
    redis2: {
      host: process.env.MUTEX_REDIS2_HOST || 'localhost',
      port: parseInt(process.env.MUTEX_REDIS2_PORT, 10) || 6379,
    },
    redis3: {
      host: process.env.MUTEX_REDIS3_HOST || 'localhost',
      port: parseInt(process.env.MUTEX_REDIS3_PORT, 10) || 6379,
    },
  },
  notification: {
    mqttUrl: process.env.NOTIFICATION_MQTT_URL || 'mqtt://localhost:1883',
    mergeNotificationThreshold:
      parseInt(process.env.NOTIFICATION_MERGE_THRESHOLD, 10) || 1800,
  },
});
