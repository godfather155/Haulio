# Deployment Guide

This repository is deployable without Docker using pnpm workspaces.

## Services
- **Backend API**: `apps/api` on Render (Node service)
- **Web frontend**: `apps/web` on Vercel
- **Driver frontend**: currently part of `apps/web` routes (`/driver`). There is no separate `apps/driver` app in this repository.

## 1) Render deployment (`apps/api`)

### Build and start commands
- Build command: `pnpm install --frozen-lockfile && pnpm --filter @truckerio/api build`
- Start command: `pnpm --filter @truckerio/api start`

### Required environment variables
- `DATABASE_URL`
- `WEB_ORIGIN`
- `SESSION_SECRET`
- `CSRF_SECRET`

### Recommended environment variables
- `NODE_ENV=production`
- `PORT` (Render injects this automatically)
- `HOST=0.0.0.0`
- `CORS_ALLOWED_ORIGINS` (comma-separated, defaults to `WEB_ORIGIN`)
- `CORS_ALLOW_LOCALHOST=false`
- `REQUEST_LOGGING_ENABLED=true`
- `REQUEST_LOGGING_INCLUDE_HEALTH=false`
- `ERROR_INCLUDE_DETAILS=false`
- `UPLOAD_DIR=./uploads`
- `MAX_UPLOAD_MB=15`

### Optional email/integration variables
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
- `EMAIL_FROM`, `EMAIL_REPLY_TO`, `RETURN_RESET_URL`
- `SAMSARA_API_BASE`, `SAMSARA_TIMEOUT_MS`

### Health check
Use `/health` as the Render health check endpoint.

## 2) Vercel deployment (`apps/web`)

### Project settings
- Root directory: `apps/web`
- Framework: Next.js
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build`

### Required environment variables
- `NEXT_PUBLIC_API_URL` (absolute API URL, e.g., `https://api.your-domain.com`)

## 3) Monorepo build commands

From repository root:
- Build all deployment targets: `pnpm build`
- Build API only: `pnpm build:api`
- Build frontends: `pnpm build:frontends`
