import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import SuccessResponseDto from 'src/commons/decorators/success-response.dto';

export const GetOneSuccessResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto | null,
) =>
  applyDecorators(
    dataDto
      ? ApiExtraModels(SuccessResponseDto, dataDto)
      : ApiExtraModels(SuccessResponseDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              data: dataDto
                ? { $ref: getSchemaPath(dataDto as DataDto) }
                : { type: 'integer', nullable: true, example: null },
            },
          },
        ],
      },
      description: 'Get record successfully',
    }),
  );
