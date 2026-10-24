import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/config';
import { HealthModule } from './health/health.module';
import { BarracasModule } from './barracas/barracas.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), HealthModule, BarracasModule],
})
export class AppModule {}
