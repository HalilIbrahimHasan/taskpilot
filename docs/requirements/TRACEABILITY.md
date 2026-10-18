# Requirements Traceability Starter

| ID | Requirement | Implementation target | Test target | State |
|---|---|---|---|---|
| R-01 | Task CRUD | `app/api/tasks.py` + Tasks/Detail pages | API CRUD + UI page tests | Implemented |
| R-02 | Dashboard KPIs | dashboard summary service + page | count reconciliation | Implemented |
| R-03 | Search/status/sort | task repository + TanStack table | API query tests | Implemented |
| R-04 | Database persistence | SQLAlchemy + Alembic | migration + API integration | Implemented |
| R-05 | 30+ deterministic tasks | `app/seed.py` | idempotent seed test (36) | Implemented |
| R-06 | OpenAPI/errors | Pydantic schemas + handlers | OpenAPI and 422/404 tests | Implemented |
| STORY-A | Reject past due date on creation | Deferred | `test_past_due_date_is_allowed` | NOT IMPLEMENTED |
| STORY-B | Filter by priority | Deferred | `test_priority_filter_is_not_exposed` | NOT IMPLEMENTED |
