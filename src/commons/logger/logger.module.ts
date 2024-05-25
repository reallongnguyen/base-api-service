import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { DestinationStream } from 'pino';
import { Options } from 'pino-http';
import { PrettyOptions } from 'pino-pretty';

import { LoggerService } from './logger.service';
import { AppConfigModule } from '../config/config.module';

const getPinoHttpOptions = (
  options,
):
  | Options
  | DestinationStream
  | [opts: Options, stream: DestinationStream] => ({
  level: options.level,
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: join(__dirname, 'pino-pretty-transport'),
          options: {
            colorize: true,
          } as PrettyOptions,
        }
      : undefined,
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    }
    if (res.statusCode >= 500 || err) {
      return 'error';
    }
    if (res.statusCode >= 300 && res.statusCode < 400) {
      return 'silent';
    }
    return 'info';
  },
  customReceivedMessage: (req) => `Request received: ${req.method} ${req.url}`,
  customSuccessMessage: (req, res) => {
    if (res.statusCode === 404) {
      return `Resource not found on request ${req.method} ${req.url}`;
    }
    return `Request ${req.method} ${req.url} completed with status code: ${res.statusCode}`;
  },
  customErrorMessage: (req, res) => {
    return `Request ${req.method} ${req.url} errored with status code: ${res.statusCode}`;
  },
  customAttributeKeys: {
    req: 'request',
    res: 'response',
    err: 'error',
  },
});

/**
 *
 */
@Module({
  imports: [
    AppConfigModule,
    PinoLoggerModule.forRootAsync({
      // eslint-disable-next-line no-use-before-define
      imports: [LoggerModule],
      inject: [LoggerService],
      useFactory: (loggerService: LoggerService) => {
        return {
          pinoHttp: getPinoHttpOptions({ level: loggerService.level }),
        };
      },
    }),
  ],
  providers: [ConfigService, LoggerService],
  exports: [ConfigService, LoggerService],
})
export class LoggerModule {}
