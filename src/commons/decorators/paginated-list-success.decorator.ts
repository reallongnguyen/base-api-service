import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import SuccessResponseDto from 'src/commons/decorators/success-response.dto';
import Collection from 'src/commons/models/Collection';

export const PaginatedSuccessResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(SuccessResponseDto, Collection, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              data: {
                allOf: [
                  { $ref: getSchemaPath(Collection) },
                  {
                    properties: {
                      edges: {
                        type: 'array',
                        items: { $ref: getSchemaPath(dataDto) },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      description: 'Get paginated list records successfully',
    }),
  );
