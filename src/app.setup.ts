import { INestApplication } from '@nestjs/common';

// Configuração compartilhada entre a API real (main.ts) e os testes de integração,
// para que os testes exercitem exatamente o mesmo comportamento.
export function configureApp(app: INestApplication): INestApplication {
  // Mesmo prefixo que o CloudFront encaminha para a API na AWS (/api/*).
  app.setGlobalPrefix('api');
  return app;
}
