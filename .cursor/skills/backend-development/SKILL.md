---
name: backend-development
description: Implements typed FastAPI business behavior for TaskPilot. Use for routes, schemas, services, repositories, validation, or error handling.
---

# Backend Development

1. Confirm the endpoint contract and status codes.
2. Validate requests with Pydantic schemas.
3. Keep business rules in services and queries in repositories.
4. Use dependency-injected SQLAlchemy sessions.
5. Return structured validation and not-found errors.
6. Add tests for success, invalid input, malformed IDs, and missing records.
7. Run Ruff and pytest.

Never reject past due dates or expose priority filtering until approved.
