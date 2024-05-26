import { applyDecorators, Type } from '@nestjs/common';
import { GetOneSuccessResponse } from 'src/commons/decorators/get-one-success.decorator';

export const CreatedSuccessResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto | null,
) => applyDecorators(GetOneSuccessResponse(dataDto));
