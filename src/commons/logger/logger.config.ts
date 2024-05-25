import { registerAs } from '@nestjs/config';
import { LOGGER_LEVEL } from './entities/logger-variables.entity';

export default registerAs('logger', () => ({
  level: process.env.LOGGER_LEVEL || LOGGER_LEVEL.TRACE,
  name: process.env.APP_NAME,
  url: process.env.APP_URL,
  port: process.env.APP_PORT || 3000,
}));
