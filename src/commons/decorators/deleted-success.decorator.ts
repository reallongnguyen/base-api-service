import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import SuccessResponseDto from 'src/commons/decorators/success-response.dto';
import Collection from 'src/commons/models/Collection';

export const DeletedSuccessResponse = () =>
  applyDecorators(
    ApiExtraModels(SuccessResponseDto, Collection),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              data: {
                type: 'integer',
                nullable: true,
                example: null,
              },
            },
          },
        ],
      },
      description: 'Deleted successfully',
    }),
  );
