import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barraca } from './barraca.entity';
import { BarracasController } from './barracas.controller';
import { BarracasService } from './barracas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Barraca])],
  controllers: [BarracasController],
  providers: [BarracasService],
})
export class BarracasModule {}
