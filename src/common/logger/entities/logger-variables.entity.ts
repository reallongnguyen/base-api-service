import { IsEnum } from 'class-validator';

export enum LOGGER_LEVEL {
  TRACE = 'trace',
  WARN = 'warn',
  DEBUG = 'debug',
  INFO = 'info',
  ERROR = 'error',
  FATAL = 'fatal',
  SILENT = 'silent',
}

export class LoggerVariables {
  @IsEnum(LOGGER_LEVEL)
  LOGGER_LEVEL: string;
}
