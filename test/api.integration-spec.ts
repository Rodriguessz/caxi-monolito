import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';

// Teste de integração: sobe a API inteira (módulos, TypeORM, rotas) contra um
// PostgreSQL real e faz requisições HTTP. Exige o banco no ar (DATABASE_URL).
describe('API (integração com PostgreSQL)', () => {
  let app: INestApplication;
  let db: DataSource;
  // Slug único por execução: o teste não depende do seed nem colide com dados existentes
  const slug = `teste-integracao-${Date.now()}`;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = configureApp(moduleRef.createNestApplication());
    await app.init();

    db = app.get(DataSource);
    await db.runMigrations();
    await db.query(`INSERT INTO barracas (nome, slug) VALUES ($1, $2)`, ['Barraca de Teste', slug]);
  });

  afterAll(async () => {
    await db?.query(`DELETE FROM barracas WHERE slug = $1`, [slug]);
    await app?.close();
  });

  it('GET /api/health/live responde 200', async () => {
    await request(app.getHttpServer()).get('/api/health/live').expect(200, { status: 'ok' });
  });

  it('GET /api/health/ready confirma o banco no ar', async () => {
    const res = await request(app.getHttpServer()).get('/api/health/ready').expect(200);

    expect(res.body.info.database.status).toBe('up');
  });

  it('GET /api/barracas/:slug devolve a barraca gravada no banco, só com campos públicos', async () => {
    const res = await request(app.getHttpServer()).get(`/api/barracas/${slug}`).expect(200);

    expect(res.body).toEqual({ nome: 'Barraca de Teste', slug });
  });

  it('GET /api/barracas/:slug devolve 404 para slug inexistente', async () => {
    const res = await request(app.getHttpServer()).get('/api/barracas/nao-existe-mesmo').expect(404);

    expect(res.body.message).toBe('Barraca não encontrada');
  });

  it('o banco tem a extensão PostGIS habilitada pela migration', async () => {
    const [row] = await db.query(`SELECT extname FROM pg_extension WHERE extname = 'postgis'`);

    expect(row?.extname).toBe('postgis');
  });
});
