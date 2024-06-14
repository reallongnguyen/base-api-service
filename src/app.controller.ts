import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import HttpResponse from './commons/models/HttpResponse';
import { version } from '../package.json';

@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  @Get()
  get(): HttpResponse<Record<string, string>> {
    return HttpResponse.ok({
      ...this.configService.get<Record<string, string>>('app'),
      version,
    });
  }
}
