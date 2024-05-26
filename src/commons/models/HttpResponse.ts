import { HttpException, ValidationError } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import * as lodash from 'lodash';
import { errorMessages, makeDummyErr } from './messages/errorMessage';

export interface AppError {
  message: string;
  code: number;
}

export enum MessageType {
  // 200 201
  SUCCESS = 'success',
  // 400
  VALIDATION_FAILED = 'validation_failed',
  BAD_REQUEST = 'bad_request',
  // 401
  UNAUTHORIZED = 'authentication_failed',
  // 403
  FORBIDDEN = 'forbidden',
  // 404
  NOT_FOUND = 'not_found',
  // 500
  INTERNAL_SERVER_ERROR = 'internal_server_error',
}

export const mapHttpCodeToMessage = {
  // 200 201
  200: 'SUCCESS',
  201: 'SUCCESS',
  // 400
  400: 'BAD_REQUEST',
  // 401
  401: 'AUTHENTICATION_FAILED',
  // 403
  403: 'FORBIDDEN',
  // 404
  404: 'NOT_FOUND',
  // 500
  500: 'INTERNAL_SERVER_ERROR',
};

export default class HttpResponse<T> {
  @ApiProperty({
    description: 'API response message',
    example: MessageType.SUCCESS,
  })
  message: MessageType;

  @ApiProperty({
    description: 'API response error',
  })
  error?: AppError;

  @ApiProperty({
    description: 'API response data',
  })
  data?: T;

  constructor(message: MessageType, error?: AppError, data?: T) {
    this.message = message;
    this.error = error;
    this.data = data;
  }

  static ok<T = any>(data?: T): HttpResponse<T> {
    return new HttpResponse(MessageType.SUCCESS, undefined, data);
  }

  static error(
    path: string,
    extra?: {
      msgParams?: Record<string, string | number | boolean>;
    },
  ): HttpException {
    const errorConfig = lodash.get(errorMessages, path, makeDummyErr(path));
    const { httpCode, code, message } = errorConfig;
    const error: AppError = { code, message };

    // replace {{param}} in error message with value
    if (extra?.msgParams) {
      const matchArr = error.message.match(/{{(.*?)}}/g) || [];
      // remove "{{" and "}}" in matchArr
      const params = matchArr.map((key) => key.slice(2, key.length - 2));

      params.forEach((param) => {
        if (extra.msgParams && extra.msgParams[param] !== undefined) {
          error.message = error.message.replace(
            `{{${param}}}`,
            String(extra.msgParams[param]),
          );
        }
      });
    }

    return new HttpException(
      new HttpResponse(
        mapHttpCodeToMessage[httpCode] || mapHttpCodeToMessage[500],
        error,
        undefined,
      ),
      httpCode,
    );
  }

  static transformValidatorError(errors: ValidationError[]): HttpException {
    const validateErrorTemplate = errorMessages.validation.validationFailed;
    const firstError = errors[0];
    const errorMessage = Object.values(firstError.constraints as any)[0];

    return new HttpException(
      new HttpResponse(MessageType.VALIDATION_FAILED, {
        message: errorMessage as string,
        code: validateErrorTemplate.code,
      }),
      validateErrorTemplate.httpCode,
    );
  }

  static customError(
    message: MessageType,
    httpCode: number,
    error: AppError,
  ): HttpException {
    return new HttpException(
      new HttpResponse(message, error, undefined),
      httpCode,
    );
  }
}
