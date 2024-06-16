import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaService } from 'src/prisma.service';
import { HealthController } from './health.controller';
import { CacheHealthIndicator } from './cache.health';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [PrismaService, CacheHealthIndicator],
})
export class HealthModule {}
