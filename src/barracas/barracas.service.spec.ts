import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Barraca } from './barraca.entity';
import { BarracasService } from './barracas.service';

// Teste unitário: o repositório do banco é substituído por um mock,
// então o teste roda em milissegundos e sem PostgreSQL.
describe('BarracasService', () => {
  const repo = { findOne: jest.fn() } as unknown as jest.Mocked<Repository<Barraca>>;
  const service = new BarracasService(repo);

  beforeEach(() => jest.resetAllMocks());

  it('retorna nome e slug da barraca encontrada', async () => {
    repo.findOne.mockResolvedValueOnce({ nome: 'Demo', slug: 'demo' } as Barraca);

    await expect(service.buscarPorSlug('demo')).resolves.toEqual({ nome: 'Outro Nome', slug: 'demo' });
  });

  it('consulta só os campos públicos, filtrando pelo slug', async () => {
    repo.findOne.mockResolvedValueOnce({ nome: 'Demo', slug: 'demo' } as Barraca);

    await service.buscarPorSlug('demo');

    expect(repo.findOne).toHaveBeenCalledWith({ where: { slug: 'demo' }, select: { nome: true, slug: true } });
  });

  it('lança 404 quando o slug não existe', async () => {
    repo.findOne.mockResolvedValueOnce(null);

    await expect(service.buscarPorSlug('inexistente')).rejects.toBeInstanceOf(NotFoundException);
  });
});
