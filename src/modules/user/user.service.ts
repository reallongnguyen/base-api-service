import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AppResult, Collection } from 'src/common/models';
import { Logger } from 'nestjs-pino';
import { User } from './models/user.model';
import { Role } from './models/role.model';

export class UserUpsertInput {
  authId: string;
  name: string;
  avatar?: string;
}

export class UserOutput implements Omit<User, 'createdAt' | 'updatedAt'> {
  id: string;
  authId: string;
  name: string;
  avatar: string;
  roles: Role[];

  static fromUser(u: User): UserOutput {
    const uo = new UserOutput();

    uo.id = u.id;
    uo.authId = u.authId;
    uo.name = u.name;
    uo.avatar = u.avatar;
    uo.roles = u.roles;

    return uo;
  }
}

export class ProfileOutput extends UserOutput {}

export class ListUserInput {
  name?: string;
  offset?: number;
  limit?: number;
  orderBy?: 'name';
  orderDirection?: 'asc' | 'desc';
}

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private logger: Logger,
  ) {}

  async users(
    params: ListUserInput,
  ): Promise<AppResult<Collection<UserOutput>, string>> {
    const { name, offset, limit, orderBy, orderDirection } = params;

    try {
      const users = await this.prisma.user.findMany({
        skip: offset,
        take: limit,
        where: { name },
        orderBy: { [orderBy]: orderDirection },
      });

      const total = await this.prisma.user.count();

      return {
        data: {
          edges: users.map(UserOutput.fromUser),
          pagination: {
            total,
            limit,
            offset,
          },
        },
      };
    } catch (err) {
      this.logger.error(`user: list: ${err.message}`);

      return { err: 'common.serverError' };
    }
  }

  async createOrUpdateUser(
    input: UserUpsertInput,
  ): Promise<AppResult<UserOutput, string>> {
    try {
      const user = await this.prisma.user.upsert({
        where: { authId: input.authId },
        create: {
          ...input,
          roles: [Role.user],
        },
        update: input,
      });

      return { data: UserOutput.fromUser(user) };
    } catch (err) {
      this.logger.error(`user: createOrUpdateUser: ${err.message}`);

      return { err: 'common.serverError' };
    }
  }

  async getProfile(userId: string): Promise<AppResult<ProfileOutput, string>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        this.logger.error(
          `user: getProfile: user ${JSON.stringify(userId)} not found`,
        );

        return { err: 'user.getProfile.notFound' };
      }

      return { data: ProfileOutput.fromUser(user) };
    } catch (err) {
      this.logger.error(`user: getProfile: ${err.message}`);

      return { err: 'common.serverError' };
    }
  }
}
