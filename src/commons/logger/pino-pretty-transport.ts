/* eslint-disable import/no-import-module-exports */
import PinoPretty, { PrettyOptions, colorizerFactory } from 'pino-pretty';
import { red, gray, green, blue, yellow } from 'colors';

const levelColorize = colorizerFactory(true);
const levelPrettifier = (logLevel) => {
  const baseLevelLog = `${gray('LEVEL')}: ${levelColorize(logLevel)}`;
  switch (logLevel) {
    case 10:
      return `🤔 ${baseLevelLog}`;
    case 20:
      return `🥲  ${baseLevelLog}`;
    case 40:
      return `😳 ${baseLevelLog}`;
    case 50:
      return `😱 ${baseLevelLog}`;
    default:
      return baseLevelLog;
  }
};

module.exports = (opts: PrettyOptions) =>
  PinoPretty({
    ...opts,
    levelFirst: true,
    // hideObject: true,
    translateTime: 'UTC:dd.mm.yyyy, h:MM:ss TT Z',
    customPrettifiers: {
      time: (timestamp: any) => `🕰  ${timestamp}`,
      level: levelPrettifier,
      pid: (pid) => red(pid as string),
      responseTime: (timestamp: any) => `⏱ ${timestamp / 1000}s`,
    },
    ignore: 'context,hostname,request,response',
    messageFormat: (log) => {
      const message = (log.msg ?? '') as string;
      switch (log.level) {
        case 10:
          return green(message);
        case 20:
          return blue(message);
        case 40:
          return yellow(message);
        case 50:
          return red(message);
        default:
          return message;
      }
    },
  });
