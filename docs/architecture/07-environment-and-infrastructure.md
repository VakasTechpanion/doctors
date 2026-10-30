# Environment Variables & Infrastructure

Copy root `.env.example` to `.env` for local Docker Compose.

## Required (local dev)

| Variable | Used by | Description |
|----------|---------|-------------|
| `NODE_ENV` | api, web | `development` \| `production` \| `test` |
| `DATABASE_URL` | api, prisma | PostgreSQL connection string |
| `REDIS_URL` | api | Redis for cache/rate limit/jobs |
| `JWT_ACCESS_SECRET` | api | Access token signing (32+ chars) |
| `JWT_REFRESH_SECRET` | api | Refresh token HMAC/pepper |
| `API_PORT` | api | Default `3001` |
| `API_GLOBAL_PREFIX` | api | Default `api/v1` |
| `CORS_ORIGIN` | api | Web origin, e.g. `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | web | e.g. `http://localhost:3001/api/v1` |

## Optional (Phase 5+)

| Variable | Description |
|----------|-------------|
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET` | Payments |
| `EMAIL_PROVIDER` / `SMTP_*` / `RESEND_API_KEY` | Email |
| `SMS_PROVIDER` / `TWILIO_*` | SMS |
| `STORAGE_PROVIDER` / `S3_*` | Private object storage |
| `VIDEO_PROVIDER` / `DAILY_API_KEY` | Teleconsultation |

## Docker Compose Services (Phase 1)

- `postgres:16` — primary database
- `redis:7` — cache/queue
- `api` — NestJS (optional profile for dev; local can run on host)
- `web` — Next.js (optional)

## Production (guidance)

- Managed PostgreSQL with automated backups and PITR
- Redis managed instance
- S3-compatible private bucket with IAM-scoped credentials
- Secrets in vault (not `.env` in images)
- Separate staging/production; **no demo seed in production**

## Health Checks

- `GET /api/v1/health` — process up
- `GET /api/v1/health/ready` — PostgreSQL `SELECT 1`, Redis `PING`
