---
name: database-management
description: Manages TaskPilot SQLAlchemy models, Alembic migrations, PostgreSQL compatibility, and deterministic seed data. Use for schema or persistence changes.
---

# Database Management

1. Update the ORM model and create a reviewed Alembic migration.
2. Keep migrations portable to PostgreSQL; SQLite may be used only for local workshops/tests.
3. Use UUID keys, UTC-aware timestamps, and named status/priority enums.
4. Update the deterministic UUID seed upsert when fixtures change.
5. Apply migrations to a disposable database and run the seed twice.
6. Confirm counts and constraints after both runs.

Never use `create_all` as the application migration strategy.
