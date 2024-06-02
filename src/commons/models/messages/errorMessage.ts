import { HttpStatus } from '@nestjs/common';

export const makeDummyErr = (path: string) => ({
  httpCode: 500,
  code: 1000000,
  message: `error message '${path}' is not defined yet`,
});

/**
 * Pattern of error codes xxyyzzz
 * xx is the increment number for a feature group likes user, order, product
 * yy is the increment number for an API group likes CRUD users
 * zzz is increment number
 */
export const errorMessages = {
  common: {
    serverError: {
      httpCode: 500,
      code: 1000001,
      message: 'internal server error',
    },
    invalidToken: {
      httpCode: 401,
      code: 1000002,
      message: 'access token has expired or is not yet valid',
    },
    noPrivilege: {
      httpCode: 403,
      code: 1000003,
      message: 'require any of roles [{{roles}}]',
    },
  },
  validation: {
    validationFailed: {
      httpCode: 400,
      code: 1000003,
      message:
        'this message is representative of all validation error messages that depend on the class-validator library. Because we expect all validation errors to be caught at the front end, we do not specify it in Swagger',
    },
  },
  user: {
    create: {
      incorrectAuthId: {
        httpCode: HttpStatus.BAD_REQUEST,
        code: 1100000,
        message: 'auth ID is incorrect',
      },
    },
  },
};
