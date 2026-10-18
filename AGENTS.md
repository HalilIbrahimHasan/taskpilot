# TaskPilot — Agent Operating Contract

Build ONLY Project 01: TaskPilot, a working task-management SaaS. Read `docs/requirements/PRODUCT_REQUIREMENTS.md`, `docs/architecture/README.md`, and applicable `.cursor/rules/*.mdc` before changing code. Invoke the most relevant `.cursor/skills/<name>/SKILL.md` for each task.

## Stack
Frontend React/Vite/TypeScript, Tailwind, shadcn/ui, React Router, TanStack Table, Recharts, Lucide. Backend Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2, Alembic, pytest/HTTPX. PostgreSQL. Monorepo deployment on Render.

## Nonnegotiables
- Implement real functionality, not mocked screens. Prefer simple modular code and clear teaching examples.
- **DEFERRED STORIES:** do NOT implement validation rejecting past due dates on task creation (STORY-A) or priority filtering (STORY-B) until expressly authorized. Task priority values, display, and sorting may exist. Existing due-date storage is allowed. Do not accidentally introduce these features through generic filters or schema constraints.
- Task status enum: `pending`, `in_progress`, `completed`; priority enum: `low`, `medium`, `high`.
- API base `/api/v1`, plus `/health`. Never hardcode credentials or secrets.
- Use stable `data-testid` only for key UI controls, semantic roles for the rest.
- Every API mutation must validate input and return consistent errors. Use UTC-aware timestamps.
- Database migrations are the schema source of truth. Seed must be deterministic and idempotent.
- Add tests and docs with changes; do not deploy or publish without user approval.

## Workflow
1. Read relevant requirements and story acceptance criteria.
2. Plan affected frontend/backend/database/test/docs files.
3. Implement smallest complete vertical slice.
4. Run available lint/typecheck/tests and report actual results, not assumptions.
5. Update traceability and diagrams when contracts or architecture change.
6. Never claim commands, Jira access, installations, CI or deployment were verified unless actually checked.
