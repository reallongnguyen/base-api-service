import { ApiProperty, OmitType } from '@nestjs/swagger';

import AppResponse from 'src/common/models/HttpResponse';

export default class FailResponseDto extends OmitType(AppResponse, [
  'data',
] as const) {
  @ApiProperty({
    description: 'API request result',
    example: false,
  })
  success: boolean;
}
