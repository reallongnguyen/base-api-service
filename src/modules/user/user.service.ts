import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import Collection from 'src/commons/models/Collection';
import { AppResult } from 'src/commons/models/AppResult';
import { Logger } from 'nestjs-pino';
import { uuidv7 } from 'uuidv7';
import { User } from './models/User';
import { UserCreateInput } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private logger: Logger,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<AppResult<User, string>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: userWhereUniqueInput,
      });

      if (!user) {
        this.logger.error(
          `user: get: user ${JSON.stringify(userWhereUniqueInput)} not found`,
        );

        return { err: 'user.get.notFound' };
      }

      return { data: user };
    } catch (err) {
      this.logger.error(`user: get: ${err.message}`);

      return { err: 'common.serverError' };
    }
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<AppResult<Collection<User>, string>> {
    const { skip, take, cursor, where, orderBy } = params;

    try {
      const users = await this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });

      return {
        data: {
          edges: users,
          pagination: {
            total: users.length,
            limit: take,
            offset: skip,
          },
        },
      };
    } catch (err) {
      this.logger.error(`user: list: ${err.message}`);

      return { err: 'common.serverError' };
    }
  }

  async createUser(data: UserCreateInput): Promise<AppResult<User, string>> {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          authId: uuidv7(),
        },
      });

      return { data: user };
    } catch (err) {
      this.logger.error(`user: create: ${err.message}`);

      return { err: 'common.serverError ' };
    }
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<AppResult<User, string>> {
    const { where, data } = params;

    try {
      const user = await this.prisma.user.update({
        data,
        where,
      });

      return { data: user };
    } catch (err) {
      this.logger.error(`user: update: ${err.message}`);

      return { err: 'common.serverError ' };
    }
  }

  async deleteUser(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<AppResult<User, string>> {
    try {
      const user = await this.prisma.user.delete({
        where,
      });

      return { data: user };
    } catch (err) {
      this.logger.error(`user: delete: ${err.message}`);

      return { err: 'common.serverError ' };
    }
  }
}
