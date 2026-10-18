---
name: api-contract-validation
description: Validates TaskPilot endpoints, OpenAPI schemas, response codes, query parameters, and structured errors. Use after API contract changes.
---

# API Contract Validation

- Compare routes with `PRODUCT_REQUIREMENTS.md`.
- Check `/docs` and `/openapi.json` include every endpoint.
- Verify 201 create, 204 delete, 404 unknown UUID, and 422 malformed or invalid input.
- Verify list search, status, allowed sorting, limit, and offset combinations.
- Reconcile dashboard counts with database records and UTC overdue logic.
- Confirm no `priority` query filter and that past due dates remain accepted.

Report each command and observed response; do not infer success.
