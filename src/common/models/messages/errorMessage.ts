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
        'this message is representative of all validation error messages that depend on the class-validator library',
    },
  },
  user: {
    create: {},
    list: {},
    getProfile: {
      notFound: {
        status: HttpStatus.NOT_FOUND,
        message: 'user profile not found',
      },
    },
  },
  file: {
    getUploadAvatarUrl: {},
  },
};
