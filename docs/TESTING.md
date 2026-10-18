# TaskPilot Testing Strategy

## Layers

- Backend: pytest + HTTPX against isolated SQLite sessions.
- Frontend: Vitest + Testing Library against the live API client contracts.
- Contract: OpenAPI path and query-parameter checks in `test_health.py`.
- Persistence: Alembic migrations plus an idempotent seed test.

## Coverage map

| Requirement | Test |
|---|---|
| R-01 Task CRUD | `test_task_crud`, `test_unknown_task_returns_404`, Tasks/Detail page tests |
| R-02 Dashboard | `test_dashboard_counts_and_recent_activity` |
| R-03 Search/status/sort | `test_list_search_filter_sort_and_pagination` |
| R-04 Persistence | API integration + Alembic migration |
| R-05 Seed data | `test_seed_is_idempotent_and_covers_required_variants` |
| R-06 OpenAPI/errors | `test_openapi_includes_required_endpoints`, validation tests |
| STORY-A | `test_past_due_date_is_allowed` |
| STORY-B | `test_priority_filter_is_not_exposed` |

## Definition of Done

- Acceptance criteria are implemented against the real API and database.
- Success, validation, not-found, and deferred-story guard tests pass.
- Frontend loading, empty, and error states are present.
- `make lint`, `make typecheck`, `make test`, and the frontend production build succeed.
- No secrets, unapproved deployment, STORY-A, or STORY-B behavior is introduced.

## Workshop demonstration checklist

1. Open http://localhost:5173 and confirm dashboard KPIs match seeded data.
2. Search, filter by status, sort, and paginate on the Tasks page.
3. Create a task with a past due date and confirm it is accepted.
4. Open a task detail page, change status, edit, and delete.
5. Reload the browser and confirm persistence.
6. Confirm `/docs` lists every required endpoint and has no priority filter.
