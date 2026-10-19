# TaskPilot Development Guide

## Local services

Install dependencies with `make install`. For PostgreSQL, copy both `.env.example`
files, run `make db-up`, then `make migrate seed`. Run `make backend` and
`make frontend` in separate terminals.

Without Docker, leave `backend/.env` absent. The development default uses
`backend/taskpilot.db`; migrations and API behavior remain the same.

## Database lifecycle

- Apply migrations: `make migrate`
- Load or refresh deterministic records: `make seed`
- Create a migration after model changes:
  `cd backend && .venv/bin/alembic revision --autogenerate -m "description"`
- Review generated migrations before applying them.

The seed command upserts 36 stable UUID records and is safe to rerun.

## Verification

Run `make lint`, `make typecheck`, and `make test`. Build the production client with
`cd frontend && npm run build`. GitHub Actions repeats these checks for pushes and
pull requests.

## Live deployment

Verified on 19 Oct 2026:

- GitHub: https://github.com/HalilIbrahimHasan/taskpilot
- UI: https://taskpilot-web.onrender.com
- API: https://taskpilot-api-k11v.onrender.com
- Swagger: https://taskpilot-api-k11v.onrender.com/docs
- Database: Render Postgres `taskpilot-db` (free, Oregon)

Startup runs `alembic upgrade head` and the idempotent seed. The dashboard returned 36 seeded tasks after deploy.

## Deployment checklist

1. Set `CORS_ORIGINS` to a JSON list containing the frontend origin.
2. Set `VITE_API_URL` to the public backend URL.
3. Confirm the managed database connection is injected as `DATABASE_URL`.
4. Verify migration and seed commands complete.
5. Check `/health`, `/docs`, task CRUD, browser reload persistence, and dashboard totals.

Do not commit secrets. Rotate any API key that was shared in chat.
