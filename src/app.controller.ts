import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import HttpResponse from './common/models/HttpResponse';
import { version } from '../package.json';
import { OkResponse } from './common/decorators/success-response.decorator';

@Controller()
@ApiTags('app')
export class AppController {
  constructor(private configService: ConfigService) {}

  @Get()
  @ApiOperation({
    description: 'Get app information',
    summary: 'App information',
  })
  @OkResponse(Object)
  get(): HttpResponse<Record<string, string>> {
    return HttpResponse.ok({
      ...this.configService.get<Record<string, string>>('app'),
      version,
    });
  }
}
