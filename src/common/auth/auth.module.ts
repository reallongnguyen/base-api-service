import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from 'src/common/config/config.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './role.guard';

// TODO: implement loose coupling between the auth module and the PrismaService
@Global()
@Module({
  imports: [AppConfigModule, JwtModule],
  providers: [AuthGuard, ConfigService, JwtService, RolesGuard],
  exports: [AuthGuard, ConfigService, JwtService, RolesGuard],
})
export class AuthModule {}
