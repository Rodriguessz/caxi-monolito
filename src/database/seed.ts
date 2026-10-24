import dataSource from './data-source';

// Dados fictícios apenas para o ambiente local; idempotente.
async function seed() {
  await dataSource.initialize();
  await dataSource.query(
    `INSERT INTO barracas (nome, slug, localizacao)
     VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography)
     ON CONFLICT (slug) DO NOTHING`,
    ['Barraca Demonstração (dados fictícios)', 'demo', -46.6333, -23.5505],
  );
  await dataSource.destroy();
  console.log('seed concluído');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
