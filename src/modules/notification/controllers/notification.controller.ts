import { Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { Collection, HttpResponse } from 'src/common/models';
import {
  ErrorResponse,
  OkResponse,
  PaginatedResponse,
} from 'src/common/decorators';
import {
  AuthContext,
  AuthContextInfo,
  AuthGuard,
  RequireAnyRoles,
  Role,
  RolesGuard,
} from 'src/common/auth';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  NotificationListQuery,
  NotificationOutput,
  NotificationPatchQuery,
} from './dto/notification.dto';
import { NotificationService } from '../usecases/notification.service';

@Controller({
  path: 'notifications',
  version: '1',
})
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('notifications')
@ErrorResponse('common')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @RequireAnyRoles(Role.user)
  @ApiOperation({
    summary: 'List up notifications belong to a user',
    description:
      'Return paginated notifications that belong to the authenticated user',
  })
  @PaginatedResponse(NotificationOutput)
  @ErrorResponse('notification.list')
  async list(
    @AuthContext() authCtx: AuthContextInfo,
    @Query() query: NotificationListQuery,
  ): Promise<HttpResponse<Collection<NotificationOutput>>> {
    const { data, err } = await this.notificationService.getManyNotifications({
      where: { userId: authCtx.userId },
      skip: query.offset,
      take: query.limit,
    });

    if (err) {
      throw HttpResponse.error(err);
    }

    return HttpResponse.ok(data);
  }

  @Patch('read')
  @RequireAnyRoles(Role.user)
  @ApiOperation({
    summary: 'Mark all notifications as read',
    description:
      'Mark all notifications that belong to authenticated user as read. If you want to mask a notification as read, you may add a query "id=<notification id>"',
  })
  @OkResponse(null)
  @ErrorResponse('notification.markAsRead')
  async markAsRead(
    @AuthContext() authCtx: AuthContextInfo,
    @Query() query: NotificationPatchQuery,
  ): Promise<HttpResponse<null>> {
    const { err } = await this.notificationService.markNotificationAsRead(
      authCtx.userId,
      query.id,
    );

    if (err) {
      throw HttpResponse.error(err);
    }

    return HttpResponse.ok(null);
  }
}
