import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// register module global to prevent the prisma service connects to server multiple time
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
