import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
  ) {}

  // Processo vivo, sem dependências: health check do container.
  @Get('live')
  live() {
    return { status: 'ok' };
  }

  // Pronto para tráfego: banco acessível. Health check do ALB/nginx.
  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([() => this.db.pingCheck('database', { timeout: 1500 })]);
  }
}
