import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ErrorResponse, OkResponse } from 'src/common/decorators';
import { HttpResponse } from 'src/common/models';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AuthContext,
  AuthContextInfo,
  RequireAnyRoles,
  AuthGuard,
  RolesGuard,
  Role,
} from 'src/common/auth';
import { FileService } from './file.service';
import { GetImageUploadUrlDto, UploadUrlDto } from './dto/upload-url.dto';

@Controller({
  path: 'files',
  version: '1',
})
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('files')
@ErrorResponse('common')
export class FileController {
  constructor(private assetService: FileService) {}

  @Get('avatars/upload-url')
  @RequireAnyRoles(Role.user)
  @ApiOperation({
    description: 'Get the upload url to upload avatar to storage',
    summary: 'Get the upload avatar url',
  })
  @OkResponse(UploadUrlDto)
  @ErrorResponse('file.getUploadAvatarUrl')
  async getUploadAvatarUrl(
    @Query() query: GetImageUploadUrlDto,
    @AuthContext() authCtx: AuthContextInfo,
  ): Promise<HttpResponse<UploadUrlDto>> {
    const { data, err } = await this.assetService.generateUploadAvatarUrl(
      authCtx.userId,
      query.mimeType,
      query.size,
    );

    if (err) {
      throw HttpResponse.error(err);
    }

    return HttpResponse.ok(data);
  }
}
