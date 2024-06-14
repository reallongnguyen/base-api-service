import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import HttpResponse from 'src/commons/models/HttpResponse';
import { ErrorResponse } from 'src/commons/decorators/error-response.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { RolesGuard } from 'src/modules/auth/role.guard';
import { AuthContext } from 'src/modules/auth/decorators/auth-context.decorator';
import { Role } from '@prisma/client';
import Collection from 'src/commons/models/Collection';
import {
  CreatedResponse,
  OkResponse,
  PaginatedResponse,
} from 'src/commons/decorators/success-response.decorator';
import { UserUpsertInput, UserService } from './user.service';
import { UserCreateDto, UserDto } from './dto/user.dto';
import { ProfileDto } from './dto/profile.dto';
import AuthContextInfo from '../auth/models/auth-context-info.model';
import { RequireAnyRoles } from '../auth/decorators/require-any-roles.decorator';

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
    description: 'Create a new user if not exist, otherwise update the user',
    summary: 'Create or Update an user',
  })
  @CreatedResponse(UserDto)
  @ErrorResponse('user.create', { hasValidationErr: true })
  async create(
    @Body() userData: UserCreateDto,
    @AuthContext() authCtx: AuthContextInfo,
  ): Promise<HttpResponse<UserDto>> {
    const userUpsertInput: UserUpsertInput = {
      ...userData,
      authId: authCtx.authId,
    };

    const { data: user, err } =
      await this.userService.createOrUpdateUser(userUpsertInput);

    if (err) {
      throw HttpResponse.error(err);
    }

    return HttpResponse.ok(user);
  }

  @Get()
  @RequireAnyRoles(Role.admin)
  @ApiOperation({
    description: 'Filter user with pagination',
    summary: 'List up users',
  })
  @PaginatedResponse(UserDto)
  @ErrorResponse('user.list', { hasValidationErr: true })
  async list(): Promise<HttpResponse<Collection<UserDto>>> {
    const { data, err } = await this.userService.users({});

    if (err) {
      throw HttpResponse.error(err);
    }

    return HttpResponse.ok(data);
  }

  @Get('/profile')
  @RequireAnyRoles(Role.user)
  @ApiOperation({
    description: 'Get the profile of authenticated user',
    summary: 'Get my profile',
  })
  @OkResponse(ProfileDto)
  @ErrorResponse('user.profile')
  async getProfile(
    @AuthContext() authCtx: AuthContextInfo,
  ): Promise<HttpResponse<ProfileDto>> {
    const { data, err } = await this.userService.getProfile(authCtx.userId);

    if (err) {
      throw HttpResponse.error(err);
    }

    return HttpResponse.ok(data);
  }
}
