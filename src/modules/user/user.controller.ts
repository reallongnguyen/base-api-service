import { Body, Controller, Get, Post } from '@nestjs/common';
import HttpResponse from 'src/commons/models/HttpResponse';
import { ErrorResponse } from 'src/commons/decorators/error-response.decorator';
import { PaginatedSuccessResponse } from 'src/commons/decorators/paginated-list-success.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatedSuccessResponse } from 'src/commons/decorators/created-success.decorator';
import { UserService } from './user.service';
import { UserCreateInput } from './dto/user.dto';
import { User } from './models/User';

// This is a example controller for testing the prisma client
@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('users')
@ErrorResponse('common')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    description: 'Create a new user with name and avatar URL',
    summary: 'Create a new user',
  })
  @CreatedSuccessResponse(User)
  @ErrorResponse('user.create', { hasValidationErr: true })
  async create(@Body() userData: UserCreateInput) {
    const { data: user, err } = await this.userService.createUser(userData);

    if (err) {
      throw HttpResponse.error(err);
    }

    return HttpResponse.ok(user);
  }

  @Get()
  @ApiOperation({
    description: 'Get list of user with pagination',
    summary: 'Get list of user',
  })
  @PaginatedSuccessResponse(User)
  @ErrorResponse('user.list')
  async list() {
    const { data, err } = await this.userService.users({});

    if (err) {
      throw HttpResponse.error(err);
    }

    return HttpResponse.ok(data);
  }
}
