import { DataSourceOptions } from 'typeorm';
import { Barraca } from '../barracas/barraca.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL ?? 'postgres://caxi:caxi_dev@localhost:5432/caxi',
  entities: [Barraca],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  // Schema só muda por migration versionada, em qualquer ambiente.
  synchronize: false,
};
