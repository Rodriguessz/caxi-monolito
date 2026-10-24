import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  const health = { check: jest.fn() } as unknown as jest.Mocked<HealthCheckService>;
  const db = { pingCheck: jest.fn() } as unknown as jest.Mocked<TypeOrmHealthIndicator>;
  const controller = new HealthController(health, db);

  beforeEach(() => jest.resetAllMocks());

  it('live responde sem consultar o banco', () => {
    expect(controller.live()).toEqual({ status: 'ok' });
    expect(db.pingCheck).not.toHaveBeenCalled();
  });

  it('ready faz ping no banco com timeout curto', async () => {
    health.check.mockImplementationOnce(async (indicators) => {
      await Promise.all(indicators.map((indicator) => indicator()));
      return { status: 'ok', details: {} };
    });

    await controller.ready();

    expect(db.pingCheck).toHaveBeenCalledWith('database', { timeout: 1500 });
  });
});
