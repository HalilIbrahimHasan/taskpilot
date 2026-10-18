# TaskPilot Product Requirements — v1

## Goal
Beginner-friendly, polished task management SaaS demonstrating React → FastAPI → PostgreSQL and a professional software lifecycle.

## MVP
- Dashboard: total, pending, in-progress, completed, overdue, priority breakdown, recent activity (most recently updated tasks; no audit log required).
- Tasks: create, list, detail, edit, delete, status change, title/description/priority/due date, text search, status filtering, sorting, pagination as needed.
- Priority filtering is explicitly deferred as STORY-B. UI must not expose an active priority filter until approved.
- Due dates may be in the past in MVP, including task creation. Rejecting past dates is explicitly deferred as STORY-A.
- API: GET /health; GET/POST /api/v1/tasks; GET/PATCH/DELETE /api/v1/tasks/{id}; GET /api/v1/dashboard/summary.
- At least 30 synthetic seeded tasks across statuses, priorities and relative due dates; deterministic identities and idempotent upsert.
- UI: responsive, keyboard accessible, loading/empty/error states, real API connectivity.

## Domain
Task: UUID id, title (1–120 chars), description (optional, max 2000), status, priority, due_date (nullable date), created_at, updated_at. UTC timestamps; due date is calendar date. `overdue` = due_date earlier than today's UTC date AND status != completed. The reference clock should be injectable in tests.

## Acceptance criteria
- Creating a valid task returns 201 and persists it; invalid title returns 422 with field-level details.
- Listing supports `search`, `status`, `sort_by` (`created_at`, `updated_at`, `due_date`, `title`, `priority`), `sort_order` (`asc`, `desc`), `limit`, `offset`. No `priority` filter until STORY-B.
- Editing permitted fields returns updated record; deleting returns 204; unknown ID returns 404; malformed UUID returns 422.
- Dashboard counts match database records and defined overdue logic.
- Reloading the browser preserves tasks.
- All endpoints appear in `/docs` and `/openapi.json`.

## Deferred Jira workshop stories
**STORY-A — Due Date Validation:** Upon explicit approval, newly created tasks with due_date < current business date must be rejected in both UI and API, with accessible error messages and tests. Clarify timezone/date policy before implementing. Existing tasks are unaffected unless story scope changes.
**STORY-B — Priority Filtering:** Upon explicit approval, add High/Medium/Low priority filtering to task list UI and API; combine with search/status, provide reset and empty states, add tests.

## Nonfunctional
No auth in v1; not suitable for sensitive or multi-tenant production data. CORS allowlist; env-configured database URL; no credentials committed. CI lint, typecheck, backend and frontend tests. No external deployment without approval.
