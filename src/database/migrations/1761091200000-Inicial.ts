import { MigrationInterface, QueryRunner } from 'typeorm';

export class Inicial1761091200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis`);
    await queryRunner.query(`
      CREATE TABLE barracas (
        id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        nome        varchar(120) NOT NULL,
        slug        varchar(80)  NOT NULL UNIQUE,
        localizacao geography(Point, 4326),
        criado_em   timestamptz  NOT NULL DEFAULT now()
      )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE barracas`);
  }
}
