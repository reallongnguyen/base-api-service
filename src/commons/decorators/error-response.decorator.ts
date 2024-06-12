import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import * as lodash from 'lodash';
import { errorMessages } from 'src/commons/models/messages/errorMessage';
import FailResponseDto from 'src/commons/decorators/fail-response.dto';
import HttpResponse, { AppError } from 'src/commons/models/HttpResponse';

export const ErrorResponse = (
  errorGroup: string,
  options?: { hasValidationErr: boolean },
) => {
  const errorConfig = lodash.get(errorMessages, errorGroup, {});

  if (options?.hasValidationErr) {
    const { validationFailed } = errorMessages.validation;
    (errorConfig as any).validationFailed = validationFailed;
  }

  const errorGroups: Record<number, AppError[]> = {};

  Object.entries(errorConfig).forEach(([type, errorInfo]: [string, any]) => {
    const { status, description } = errorInfo;
    const error: AppError = {
      message: description,
      name: `${errorGroup}.${type}`,
    };

    if (!errorGroups[status]) {
      errorGroups[status] = [];
    }

    errorGroups[status].push(error);
  });

  const errorDecorators = Object.entries(errorGroups).map(
    ([status, errors]) => {
      const errorSchemas = errors.map((error) => ({
        properties: {
          message: {
            type: 'string',
          },
          error: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              message: {
                type: 'string',
              },
            },
            required: ['message', 'name'],
          },
        },
        example: HttpResponse.error(error.name).getResponse(),
        required: ['message', 'error'],
      }));

      return ApiResponse({
        status: Number(status),
        schema: {
          oneOf: errorSchemas,
        },
      });
    },
  );

  return applyDecorators(ApiExtraModels(FailResponseDto), ...errorDecorators);
};
