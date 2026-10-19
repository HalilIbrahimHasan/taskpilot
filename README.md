# TaskPilot

TaskPilot is a workshop-friendly task management SaaS built with React, TypeScript,
FastAPI, SQLAlchemy, and PostgreSQL.

The application includes a live dashboard, task CRUD, status changes, text search,
status filtering, sorting, pagination, deterministic seed data, and documented APIs.

## Prerequisites

- Node.js 20+
- Python 3.11+
- Docker Desktop (for local PostgreSQL)

## Setup

```bash
make install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
make db-up
make migrate
make seed
```

For a lightweight workshop run without Docker, omit `backend/.env`; the backend defaults
to a local SQLite database. PostgreSQL remains the configured production database and
the target in `backend/.env.example`.

Run the services in separate terminals:

```bash
make backend
make frontend
```

Open:

- Frontend: http://localhost:5173
- API health: http://localhost:8000/health
- API documentation: http://localhost:8000/docs

## Live deployment

GitHub: https://github.com/HalilIbrahimHasan/taskpilot

Verified Render URLs:

- UI: https://taskpilot-web.onrender.com
- API health: https://taskpilot-api-k11v.onrender.com/health
- Swagger: https://taskpilot-api-k11v.onrender.com/docs

The managed Postgres instance is `taskpilot-db` on Render. Free web services sleep after inactivity and may take about a minute to wake. Free Postgres expires after 30 days unless upgraded.

## Verification

```bash
make lint
make typecheck
make test
cd frontend && npm run build
```

## Repository layout

- `frontend/` — React/Vite client
- `backend/` — FastAPI service
- `database/` — schema and seed notes
- `docs/` — requirements, architecture, and testing docs
- `docker-compose.yml` — local PostgreSQL
- `render.yaml` — deployment blueprint (not deployed automatically)

## API

- `GET /health`
- `GET`, `POST /api/v1/tasks`
- `GET`, `PATCH`, `DELETE /api/v1/tasks/{id}`
- `GET /api/v1/dashboard/summary`

Task listing supports `search`, `status`, `sort_by`, `sort_order`, `limit`, and `offset`.
See Swagger at http://localhost:8000/docs for request and response schemas.

## Deferred scope

STORY-A (rejecting past due dates) and STORY-B (priority filtering) are intentionally
not implemented. Due dates in the past remain valid until STORY-A is authorized.

No external deployment or publishing is performed without explicit approval.
