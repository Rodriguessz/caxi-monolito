## O que muda

<!-- Uma ou duas frases. Qual jornada ou área é afetada? -->

## Por quê

<!-- O problema, a regra de negócio ou a issue que motivou a mudança. -->

## Como testar

<!-- Passos para a pessoa revisora conferir. Ex.: "docker compose up --build -d e curl localhost:3000/api/barracas/demo". -->

## Checklist

- [ ] Título no padrão `tipo(area): descrição` (ele vira a mensagem do commit na `main`)
- [ ] Testes cobrindo a regra alterada, quando houver regra de negócio
- [ ] Migration incluída e reversível, se o banco mudou
- [ ] Contrato OpenAPI atualizado, se um endpoint mudou
- [ ] Nenhum segredo, senha, token ou `.env` no código
- [ ] Nenhum log com código OTP, token, cookie ou telefone completo
