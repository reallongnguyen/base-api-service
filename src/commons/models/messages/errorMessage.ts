import { HttpStatus } from '@nestjs/common';

export const errorMessages = {
  common: {
    serverError: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'internal server error',
    },
    invalidToken: {
      status: HttpStatus.UNAUTHORIZED,
      message: 'access token has expired or is not yet valid',
    },
    noPrivilege: {
      status: HttpStatus.FORBIDDEN,
      message: 'require any of roles [{{roles}}]',
    },
  },
  validation: {
    validationFailed: {
      status: HttpStatus.BAD_REQUEST,
      message:
        'this message is representative of all validation error messages that depend on the class-validator library. Because we expect all validation errors to be caught at the front end, we do not specify it in Swagger',
    },
  },
  user: {
    create: {
      incorrectAuthId: {
        status: HttpStatus.BAD_REQUEST,
        message: 'auth ID is incorrect',
      },
    },
  },
};
