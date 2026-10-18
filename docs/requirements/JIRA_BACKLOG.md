# TaskPilot Jira-Ready Backlog

## Epic: TASKPILOT-MVP

Deliver a responsive task-management SaaS that demonstrates a production-style
React → FastAPI → PostgreSQL workflow.

## Implemented stories

### TP-1 — Manage tasks

As a user, I can create, view, edit, delete, and change the status of tasks.

Acceptance criteria:
- Valid creation persists and returns 201.
- Title, description, status, priority, and due date are editable.
- Unknown IDs return 404; invalid input returns field-level 422 details.
- Deletion returns 204 and the task remains absent after reload.

### TP-2 — Find and organize tasks

As a user, I can search, filter by status, sort, and paginate tasks.

Acceptance criteria:
- Search covers title and description.
- Status combines with search.
- Supported sorting matches the API contract.
- Controls provide loading, empty, and error states.

### TP-3 — Monitor delivery

As a user, I can see task totals, overdue work, priority distribution, and recent activity.

Acceptance criteria:
- Counts reconcile with persisted records.
- Overdue means due before today UTC and not completed.
- Recent activity shows the five most recently updated tasks.

### TP-4 — Provide deterministic workshop data

As an instructor, I can seed repeatable records for demonstrations.

Acceptance criteria:
- At least 30 records cover every status and priority.
- IDs are stable and reruns do not create duplicates.
- Dates include past, current, future, and null values.

## Deferred workshop stories

### STORY-A — Due date validation

Reject past due dates for newly created tasks. **Not implemented; approval required.**

### STORY-B — Priority filtering

Filter tasks by high, medium, or low priority. **Not implemented; approval required.**

## Technical tasks

- Maintain Alembic migrations and SQLAlchemy models.
- Validate OpenAPI and structured error contracts.
- Run frontend lint/typecheck/test/build and backend Ruff/pytest in CI.
- Keep Render configuration environment-driven.
- Update traceability and diagrams when contracts or architecture change.

## Definition of Done

- Acceptance criteria are implemented against the real API and database.
- Automated tests cover success, validation, not-found, and boundary behavior.
- Accessibility and responsive states are verified.
- Lint, typecheck, tests, and production build pass.
- Documentation and traceability are current.
- No secrets, unapproved deployment, STORY-A, or STORY-B behavior is introduced.
