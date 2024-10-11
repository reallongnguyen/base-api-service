import { Controller, Get, UseFilters, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from 'src/prisma.service';
import {
  FormatHttpResponseInterceptor,
  HttpExceptionFilter,
} from 'src/common/present/http';
import { CacheHealthIndicator } from './cache.health';

@Controller('health')
@UseInterceptors(new FormatHttpResponseInterceptor())
@UseFilters(new HttpExceptionFilter({}))
@ApiTags('app')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private prisma: PrismaHealthIndicator,
    private prismaService: PrismaService,
    private cache: CacheHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.prisma.pingCheck('database', this.prismaService),
      () => this.cache.isHealthy('cache'),
    ]);
  }
}
