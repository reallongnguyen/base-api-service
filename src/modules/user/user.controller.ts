import { Body, Controller, Get, Post } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { Logger } from 'nestjs-pino';
import HttpResponse from 'src/commons/models/HttpResponse';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/CreateUser.dto';

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
  async create(@Body() userData: CreateUserDTO) {
    if (userData.name === 'incorrectAuthId') {
      throw HttpResponse.error('user.create.incorrectAuthId');
    }

    try {
      const user = await this.userService.createUser({
        authId: uuidv7(),
        name: userData.name,
      });

      this.logger.debug(`user: create user ${userData.name} success`);

      return HttpResponse.ok(user);
    } catch (err) {
      this.logger.error(`user: create: ${err.message}`);

      throw HttpResponse.error('common.serverError');
    }
  }

  @Get()
  async list() {
    try {
      const res = await this.userService.users({});

      return HttpResponse.ok(res);
    } catch (err) {
      this.logger.error(`user: list: ${err.message}`);

      throw HttpResponse.error('common.serverError');
    }
  }
}
