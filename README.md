# NovaMix E-commerce

Sistema de e-commerce com backend em Fastify/TypeScript e frontend em React/Vite, com sincronização de pedidos com o CISS.

## Estrutura

```
server/   API (Fastify + TypeScript + PostgreSQL)
client/   Frontend (React + Vite + Tailwind)
```

## Requisitos

- Node.js 20+
- Docker e Docker Compose (para rodar em containers)
- PostgreSQL (banco da aplicação)

## Configuração

### Backend (`server/.env`)

Copie `server/.env.example` para `server/.env` e preencha:

| Variável | Descrição |
|---|---|
| `SERVER_PORT` | Porta interna em que a API escuta |
| `CLIENT_URL` | Origem pública do frontend (usada no CORS) — precisa bater exatamente com o host:porta de onde o client é servido |
| `DATABASE_URL` | Connection string do PostgreSQL |
| `JWT_SECRET` | Segredo usado para assinar os tokens de login |
| `CISS_DATABASE_URL` | Connection string do banco do CISS (sincronização de pedidos) |

### Frontend (`client/.env`)

Copie `client/.env.example` para `client/.env` e preencha:

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL pública da API. É *baked in* no build (Vite), então precisa estar definida **antes** de buildar a imagem |

## Rodando em desenvolvimento

```bash
# backend
cd server
npm install
npm start

# frontend
cd client
npm install
npm run dev
```

## Rodando com Docker (produção)

O `docker-compose.yml` sobe dois serviços:

- `server`: API, publicada na porta `3004` (mapeada para a `3000` interna)
- `client`: frontend buildado e servido por nginx, publicado na porta `8084`

O client chama a API diretamente pela URL definida em `VITE_API_URL` (não há proxy reverso configurado no nginx do client — ver `client/nginx.conf`). Por isso:

1. Defina `VITE_API_URL` apontando para a URL pública da API (ex: `http://SEU_DOMINIO:3004`) **antes** do build:

   ```bash
   VITE_API_URL=http://SEU_DOMINIO:3004 docker compose build client
   ```

2. Garanta que `server/.env` tenha `CLIENT_URL` igual à origem pública do client (ex: `http://SEU_DOMINIO:8084`), senão as requisições são bloqueadas por CORS.

3. Suba os serviços:

   ```bash
   docker compose up -d
   ```

> Se `VITE_API_URL` ficar vazio no build, o frontend chama caminhos relativos (ex: `/auth/login`), que caem no nginx do próprio client — que só serve estático e responde `405 Not Allowed` para métodos como POST.
