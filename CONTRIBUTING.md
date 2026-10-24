# Como contribuir com o Caxi

Toda mudança entra na `main` por Pull Request, com os checks do CI verdes. Ninguém faz push direto na `main`, nem quem administra o repositório.

## 1. Crie uma branch curta

```bash
git switch main && git pull --ff-only
git switch -c feat/vendas-pedido-duplicado
```

O nome segue `<tipo>/<descricao-em-kebab-case>`: letras minúsculas, números e hífens.

| Tipo | Quando usar | Exemplo |
|---|---|---|
| `feat` | Funcionalidade nova | `feat/onboarding-cadastro-produto` |
| `fix` | Correção de bug | `fix/acesso-codigo-expirado` |
| `refactor` | Muda o código sem mudar o comportamento | `refactor/pedidos-calculo-total` |
| `test` | Só testes | `test/estoque-idempotencia` |
| `docs` | Só documentação | `docs/readme-ambiente-local` |
| `infra` | Infraestrutura como código (AWS CDK) | `infra/cdk-cognito` |
| `ci` | Workflows do GitHub Actions | `ci/adiciona-trivy` |
| `chore` | Manutenção: dependências, configuração | `chore/atualiza-nestjs` |

Comece a descrição pela jornada ou área (`onboarding`, `operacao`, `vendas`, `resultados`, `acesso`). Assim fica claro de onde a branch vem.

Uma branch deve durar horas ou poucos dias. Se crescer demais, divida em PRs menores.

## 2. Faça commits no padrão Conventional Commits

```
<tipo>(<area>): <descrição no imperativo>

feat(pedidos): registra pedido do comprador
fix(acesso): trata código expirado
test(estoque): cobre toque duplo na confirmação
```

Os tipos são os mesmos da branch. A área é opcional, mas ajuda a ler o histórico. Um `!` antes dos dois-pontos (`feat(api)!: ...`) marca uma mudança que quebra compatibilidade.

## 3. Rode as verificações antes do push

```bash
npm run lint && npm run typecheck && npm test
docker compose up -d db && npm run test:integration
```

É o mesmo que o CI vai rodar, só que mais rápido na sua máquina.

## 4. Abra o Pull Request

- **Título:** mesmo padrão do commit, com até 72 caracteres. Com squash merge, ele vira a mensagem do commit na `main`.
- **Descrição:** o template já vem preenchido. Responda as seções e marque o checklist.
- **Revisão:** o GitHub pede revisão automaticamente a quem está no `CODEOWNERS`.

## 5. Espere os checks

| Check | O que verifica |
|---|---|
| `padroes-do-pr` | Nome da branch e título do PR |
| `qualidade` | Segredos vazados (gitleaks), lint, tipos, testes unitários, dependências vulneráveis e build |
| `integracao` | Migrations em banco vazio (aplicar, reverter e aplicar) e testes de integração |
| `ambiente-reproduzivel` | Sobe o projeto do zero com Docker Compose e testa por HTTP |

Com algum check vermelho, o merge fica bloqueado. Abra o check, leia o erro, corrija e faça push na mesma branch: o CI roda de novo.

- **Título errado:** edite no GitHub. O `padroes-do-pr` roda de novo sozinho.
- **Nome de branch errado:** renomeie em *Code → Branches → ✏️*. O GitHub atualiza o PR aberto; criar uma branch nova abriria outro PR.
- **A `main` andou e o PR ficou desatualizado:** clique em *Update branch* ou rode `git merge origin/main` e faça push.

## 6. Merge

Use **Squash and merge**. A branch é apagada automaticamente depois do merge. Localmente:

```bash
git switch main && git pull --ff-only && git branch -d <sua-branch>
```
