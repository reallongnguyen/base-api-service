import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class LoggerService {
  constructor(private configService: ConfigService) {}

  get level(): string {
    return this.configService.get<string>('logLevel');
  }
}
