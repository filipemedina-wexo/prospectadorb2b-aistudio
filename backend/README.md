# API Prospectador B2B

API REST construída com Node.js, Express e Sequelize para o mini-SaaS de prospecção B2B.

## Requisitos

- Node.js 18+
- Banco de dados MySQL acessível

## Configuração

1. Copie o arquivo `.env.example` para `.env` e ajuste as variáveis conforme sua infraestrutura.
2. Instale as dependências do projeto na raiz do repositório:

   ```bash
   npm install
   ```

3. Execute a API em modo de desenvolvimento:

   ```bash
   npm run dev:api
   ```

   > O script acima utiliza `nodemon` para recarregar o servidor automaticamente. Em produção utilize `npm run start:api`.

## Scripts disponíveis

- `npm run dev:api`: inicia o servidor com recarregamento automático (nodemon).
- `npm run start:api`: inicia o servidor em modo produção.

## Estrutura de pastas

```
backend/
  ├─ src/
  │  ├─ config/        # Configuração de banco de dados
  │  ├─ controllers/   # Regras de negócio e orquestração das rotas
  │  ├─ middleware/    # Middlewares compartilhados
  │  ├─ models/        # Modelos Sequelize e associações
  │  ├─ routes/        # Rotas REST agrupadas por domínio
  │  ├─ utils/         # Utilidades auxiliares
  │  └─ validators/    # Schemas de validação com express-validator
  └─ .env.example      # Modelo de variáveis de ambiente
```

## Endpoints principais

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET|POST|PUT|DELETE /api/leads`
- `GET|POST|PUT|DELETE /api/tags`
- `GET|POST|PUT|DELETE /api/lists`
- `GET|PUT|DELETE /api/users`

Todas as rotas (exceto login e registro) exigem header `Authorization: Bearer <token>`.
