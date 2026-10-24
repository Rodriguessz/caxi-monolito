# Caxi — monólito

ERP mobile-first para feirantes e vendedores permissionários. Este repositório contém a **API** do Caxi (NestJS + PostgreSQL/PostGIS), construída em etapas, cada uma entregue por Pull Request:

| Etapa | Conteúdo | Situação |
|---|---|---|
| 1 | API NestJS mínima + Docker Compose (API + PostgreSQL) | ✅ |
| 2 | Testes básicos (unitário e de integração com o banco) | Próxima |
| 3 | Pipeline de CI no GitHub Actions | — |
| 4 | Proteção da `main` e regras de PR | — |
| 5 | Documento explicando o conjunto | — |

## Como rodar

Pré-requisito único: **Docker** com Compose v2 (Docker Desktop no Windows/macOS).

```bash
git clone https://github.com/Rodriguessz/caxi-monolito.git
cd caxi-monolito
docker compose up --build -d
```

A primeira vez leva alguns minutos (download das imagens e build). Depois, confira:

```bash
docker compose ps -a                         # db e api "Up (healthy)"; migrate "Exited (0)"
curl localhost:3000/api/health/ready         # {"status":"ok",...,"database":{"status":"up"}}
curl localhost:3000/api/barracas/demo        # {"nome":"Barraca Demonstração (dados fictícios)","slug":"demo"}
curl localhost:3000/api/barracas/nao-existe  # 404 "Barraca não encontrada"
```

| Para | Comando |
|---|---|
| Ver os logs da API | `docker compose logs -f api` |
| Parar, mantendo os dados | `docker compose down` |
| Apagar o banco e recomeçar do zero | `docker compose down -v && docker compose up --build -d` |

O `migrate` aparecer como **Exited (0)** é o esperado: ele aplica as migrations, insere os dados de exemplo e encerra.

## Como o ambiente sobe

```
docker compose up
   │
   ├─ db        PostgreSQL 16 + PostGIS 3.4 ............ espera ficar saudável (pg_isready por TCP)
   │
   ├─ migrate   aplica as migrations + seed, e encerra ... espera terminar com código 0
   │
   └─ api       NestJS na porta 3000 ..................... saudável quando /api/health/live responde
```

Cada serviço só começa quando o anterior está pronto (`depends_on` com `condition`). Assim, a API nunca sobe contra um banco sem tabelas.

## O que cada arquivo faz

| Arquivo | Papel | Por que assim |
|---|---|---|
| `src/main.ts` | Inicia o NestJS na porta 3000, com o prefixo `/api` em todas as rotas | O prefixo é o mesmo que o CloudFront vai encaminhar para a API na AWS |
| `src/app.module.ts` | Módulo raiz: conecta o banco (TypeORM) e carrega os módulos `health` e `barracas` | Cada domínio do Caxi vira um módulo, como define o Roadmap |
| `src/health/` | `GET /api/health/live` (o processo responde?) e `GET /api/health/ready` (o banco responde?) | São os health checks que o Docker, e depois o ALB da AWS, usam para decidir se a API pode receber tráfego. Feitos com `@nestjs/terminus` |
| `src/barracas/` | Entidade, serviço e controller de barracas. `GET /api/barracas/:slug` devolve a barraca ou 404 | Primeiro módulo de domínio, para provar o caminho API → banco |
| `src/database/config.ts` | Configuração do TypeORM, com `synchronize: false` | O schema só muda por migration versionada, nunca automaticamente |
| `src/database/migrations/` | Migrations versionadas. A primeira habilita o PostGIS e cria a tabela `barracas` | O banco de qualquer pessoa, e o do CI, nasce igual, só a partir destes arquivos |
| `src/database/seed.ts` | Insere uma barraca de demonstração, marcada como fictícia. Pode rodar várias vezes (`ON CONFLICT DO NOTHING`) | Ter dados para testar, sem misturar com dados reais |
| `Dockerfile` | Imagem em 3 estágios: compila → instala só dependências de produção → imagem final rodando como usuário `node` | A imagem final fica menor, sem compilador nem código-fonte, e sem rodar como root. É a mesma imagem que irá para o ECS |
| `docker-compose.yml` | Sobe `db`, `migrate` e `api` na ordem certa | Um comando para ter o ambiente completo |
| `.env.example` | Lista as variáveis que podem ser sobrescritas | Funciona sem `.env`; as senhas são só de desenvolvimento |
| `.nvmrc` | Versão do Node (22) | Fonte única da versão, usada também pelo CI |
| `package-lock.json` | Versões exatas de todas as dependências | Junto com `npm ci`, garante que todos instalem exatamente o mesmo |

## O que torna o ambiente reproduzível

- **Versões fixadas:** imagens com tag explícita (`postgis/postgis:16-3.4`, `node:22-alpine`) e `package-lock.json` versionado.
- **Banco a partir de migrations:** nenhuma tabela é criada à mão.
- **Zero configuração manual:** nenhum passo além do `docker compose up`.
- **Ordem garantida:** cada serviço espera o anterior estar pronto.

> Docker Compose é o ambiente de **desenvolvimento**. Ele não é evidência de deploy nem de CI/CD; essas evidências vêm do GitHub Actions (etapa 3) e dos deploys na AWS.

## Desenvolvimento sem Docker (opcional)

Com Node 22 instalado, dá para rodar a API no host com recarga automática, usando só o banco no Docker:

```bash
npm ci
docker compose up -d db
npm run migration:run && npm run seed
npm run dev        # http://localhost:3000/api
```
