import { Injectable } from '@nestjs/common';

@Injectable()
export class DeepLinkHelper {
  getProfilePageDeepLink(userId: string): string {
    return `/users/${userId}/profile`;
  }
}
