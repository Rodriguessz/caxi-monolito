import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barraca } from './barraca.entity';

@Injectable()
export class BarracasService {
  constructor(@InjectRepository(Barraca) private readonly repo: Repository<Barraca>) {}

  async buscarPorSlug(slug: string): Promise<Pick<Barraca, 'nome' | 'slug'>> {
    const barraca = await this.repo.findOne({ where: { slug }, select: { nome: true, slug: true } });
    if (!barraca) throw new NotFoundException('Barraca não encontrada');
    return barraca;
  }
}
