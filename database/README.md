# TaskPilot Database

PostgreSQL is the production database. SQLite is allowed only for local workshops
and automated tests.

## Schema

The `tasks` table is created by Alembic revision `20261018_0001`:

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `title` | VARCHAR(120) | Required, 1–120 characters |
| `description` | TEXT | Optional, max 2000 characters |
| `status` | VARCHAR | `pending`, `in_progress`, `completed` |
| `priority` | VARCHAR | `low`, `medium`, `high` |
| `due_date` | DATE | Calendar date, nullable. Past dates are valid in MVP. |
| `created_at` | TIMESTAMPTZ | UTC |
| `updated_at` | TIMESTAMPTZ | UTC |

## Commands

```bash
make migrate
make seed
```

`make seed` upserts 36 deterministic UUID records and is safe to rerun.

## Deferred constraints

- STORY-A: do not reject past due dates until approved.
- STORY-B: do not add a priority filter until approved.
