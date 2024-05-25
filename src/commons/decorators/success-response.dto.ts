import { OmitType } from '@nestjs/swagger';

import AppResponse from 'src/commons/models/HttpResponse';

export default class SuccessResponseDto extends OmitType(AppResponse, [
  'error',
] as const) {}
