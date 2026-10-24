import { Controller, Get, Param } from '@nestjs/common';
import { BarracasService } from './barracas.service';

@Controller('barracas')
export class BarracasController {
  constructor(private readonly barracas: BarracasService) {}

  @Get(':slug')
  buscar(@Param('slug') slug: string) {
    return this.barracas.buscarPorSlug(slug);
  }
}
