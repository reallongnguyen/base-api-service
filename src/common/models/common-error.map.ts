import { HttpStatus } from '@nestjs/common';

export const commonErrorMap = {
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
    requirePerson: {
      status: HttpStatus.FORBIDDEN,
      message: 'require agent is a person',
    },
  },
  validation: {
    validationFailed: {
      status: HttpStatus.BAD_REQUEST,
      message:
        'this message is representative of all validation error messages that depend on the class-validator library',
    },
  },
};
