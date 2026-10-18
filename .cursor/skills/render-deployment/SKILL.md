---
name: render-deployment
description: Prepares and verifies TaskPilot Render configuration for the static frontend, FastAPI service, and managed PostgreSQL. Use for deployment planning or approved deployment work.
---

# Render Deployment

1. Review `render.yaml` without deploying.
2. Confirm build, migration, seed, start, and health-check commands.
3. Require `DATABASE_URL`, JSON `CORS_ORIGINS`, and `VITE_API_URL` environment values.
4. Verify SPA rewrites and API CORS origin alignment.
5. After explicit deployment approval, check health, Swagger, CRUD persistence, and dashboard counts.
6. Record public URLs and rollback steps.

Never expose secrets or deploy without explicit approval.
