import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import HttpResponse from 'src/commons/models/HttpResponse';
import { ErrorResponse } from 'src/commons/decorators/error-response.decorator';
import { PaginatedSuccessResponse } from 'src/commons/decorators/paginated-list-success.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatedSuccessResponse } from 'src/commons/decorators/created-success.decorator';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { RolesGuard } from 'src/modules/auth/role.guard';
import { AuthContext } from 'src/modules/auth/decorators/auth-context.decorator';
import { UserService } from './user.service';
import { UserCreateInput } from './dto/user.dto';
import { User } from './models/User';
import AuthContextInfo from '../auth/models/auth-context-info.model';
import { RequireAnyRoles } from '../auth/decorators/require-any-roles.decorator';
import { Role } from '../auth/models/role.enum';

// This is a example controller for testing the prisma client
@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(AuthGuard, RolesGuard)
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
  async create(
    @Body() userData: UserCreateInput,
    @AuthContext() authCtx: AuthContextInfo,
  ) {
    throw HttpResponse.error('user.create.incorrectAuthId');

    const { data: user, err } = await this.userService.createOrUpdateUser(
      authCtx.authId,
      userData,
    );

    if (err) {
      throw HttpResponse.error(err);
    }

    return HttpResponse.ok(user);
  }

  @Get()
  @RequireAnyRoles(Role.admin, Role.owner, Role.editor, Role.viewer)
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

  @Get('/me')
  @ApiOperation({
    description: 'Get list of user with pagination',
    summary: 'Get list of user',
  })
  @PaginatedSuccessResponse(User)
  @ErrorResponse('user.me')
  async getMe(@AuthContext() authCtx: AuthContextInfo) {
    const { data, err } = await this.userService.user({
      authId: authCtx.authId,
    });

    if (err) {
      throw HttpResponse.error(err);
    }

    return HttpResponse.ok(data);
  }

  @Get('/:id')
  @RequireAnyRoles(Role.admin, Role.editor)
  @ApiOperation({
    description: 'Get information of :id user',
    summary: 'Get a user',
  })
  @PaginatedSuccessResponse(User)
  @ErrorResponse('user.get')
  async get(@Param('id', ParseIntPipe) id: number) {
    const { data, err } = await this.userService.user({ id });

    if (err) {
      throw HttpResponse.error(err);
    }

    return HttpResponse.ok(data);
  }
}
