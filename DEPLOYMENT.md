# Production Deployment Guide

## Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (optional)

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `AUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `AUTH_URL` | Your production URL |
| `NEXT_PUBLIC_APP_URL` | Public app URL |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password (change in production!) |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog analytics key (optional) |

## Local Development

```bash
npm install
cp .env.example .env
docker compose up postgres redis -d
npx prisma db push
npm run db:seed
npm run dev
```

## Docker Deployment

```bash
docker compose up --build -d
docker compose exec app npx prisma db push
docker compose exec app npm run db:seed
```

## Vercel Deployment

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables from `.env.example`
4. Use Vercel Postgres and Upstash Redis (or external providers)
5. Deploy

### Vercel-specific notes

- Set `DATABASE_URL` to your Vercel Postgres connection string
- Set `REDIS_URL` to Upstash Redis URL
- Run `prisma db push` via Vercel build or manually after first deploy
- Run seed: `npx tsx prisma/seed.ts` locally against production DB (once)

## Database Migrations

```bash
# Development
npm run db:migrate

# Production (push schema)
npx prisma db push
```

## Health Checks

- `GET /api/health` — Service health
- `GET /api/status` — Detailed status with metrics

## Security Checklist

- [ ] Change `AUTH_SECRET` and `ADMIN_PASSWORD`
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Configure rate limits via env vars
- [ ] Set up monitoring on `/api/health`
- [ ] Review CSP headers in `next.config.ts`

## Scaling

- **App**: Horizontal scaling via Vercel serverless or Docker replicas
- **Database**: Connection pooling (PgBouncer / Prisma Accelerate)
- **Redis**: Upstash or Redis Cluster for cache layer
- **CDN**: Vercel Edge Network handles static assets

## Monitoring

- PostHog for product analytics
- Admin dashboard at `/admin` for operational metrics
- System logs table for error tracking
