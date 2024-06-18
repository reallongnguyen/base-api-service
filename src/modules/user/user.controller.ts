import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpResponse, Collection } from 'src/common/models';
import {
  ErrorResponse,
  CreatedResponse,
  OkResponse,
  PaginatedResponse,
} from 'src/common/decorators';
import {
  AuthContextInfo,
  RequireAnyRoles,
  AuthContext,
  RolesGuard,
  AuthGuard,
  Role,
} from 'src/common/auth';
import { UserUpsertInput, UserService } from './user.service';
import { UserCreateDto, UserDto } from './dto/user.dto';
import { ProfileDto } from './dto/profile.dto';

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
