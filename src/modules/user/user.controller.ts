import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { Logger } from 'nestjs-pino';
import { UserService } from './user.service';

// This is a example controller for testing the prisma client
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  @Post()
  async create(@Body() userData: { name?: string }) {
    try {
      const user = await this.userService.createUser({
        authId: uuidv7(),
        name: userData.name,
      });

      this.logger.debug(`user: create user ${userData.name} success`);

      return {
        message: 'success',
        data: user,
      };
    } catch (err) {
      this.logger.error(`user: create: ${err.message}`);

      return new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async list() {
    try {
      const users = await this.userService.users({});

      return {
        message: 'success',
        data: {
          edges: users,
          pagination: {
            total: users.length,
            offset: 0,
            limit: 0,
          },
        },
      };
    } catch (err) {
      this.logger.error(`user: list: ${err.message}`);

      return new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
