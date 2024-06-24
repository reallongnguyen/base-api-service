import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redlock, { RedlockAbortSignal } from 'redlock';
import Client from 'ioredis';
import { Mutex } from '../usecases/interfaces/mutex.interface';

@Injectable()
export class RedlockMutex implements Mutex {
  private redlock: Redlock;
  lockDuration = 5000;

  constructor(private config: ConfigService) {
    const redis1 = new Client({
      host: config.get<string>('mutex.redis1.host'),
      port: config.get<number>('mutex.redis1.port'),
    });

    this.redlock = new Redlock([redis1], {
      // The expected clock drift; for more details see:
      // http://redis.io/topics/distlock
      driftFactor: 0.01, // multiplied by lock ttl to determine drift time

      // The max number of times Redlock will attempt to lock a resource
      // before erroring.
      retryCount: 0,

      // the time in ms between attempts
      retryDelay: 200, // time in ms

      // the max time in ms randomly added to retries
      // to improve performance under high contention
      // see https://www.awsarchitectureblog.com/2015/03/backoff.html
      retryJitter: 200, // time in ms

      // The minimum remaining time on a lock before an extension is automatically
      // attempted with the `using` API.
      automaticExtensionThreshold: 500, // time in ms
    });
  }

  async lock<T>(
    keys: string[],
    cb: (signal: RedlockAbortSignal) => Promise<T>,
  ) {
    return this.redlock.using<T>(keys, this.lockDuration, cb);
  }
}
