# Cursor Master Prompt — TaskPilot Project 01

Act as Principal Software Architect, Senior Full Stack Engineer and AI coding mentor. Build a real TaskPilot application incrementally. First read AGENTS.md, requirements, all applicable .cursor rules, and relevant skills. Do not implement other projects. Never implement STORY-A or STORY-B until I explicitly authorize them.

Stack: React/Vite/TypeScript/Tailwind/shadcn/ui/React Router/TanStack Table/Recharts/Lucide/Axios; FastAPI/Pydantic/SQLAlchemy/Alembic/pytest/HTTPX; PostgreSQL. Repo layout: frontend/, backend/, database/, docs/, .cursor/, .github/, render.yaml.

Work in these checkpoints, stopping for my review after each:
1. Scaffold monorepo, local env examples, dev scripts, docs; show commands and run basic checks.
2. Database model, Alembic migration, deterministic idempotent 30+ record seed; verify with disposable DB.
3. Backend routes and Swagger; implement validation, errors, search/status filter/sort, dashboard summary; test via pytest/HTTPX. No priority filter or past-date rejection.
4. Frontend shell, task list, create/edit/detail/delete, dashboard, loading/error/empty states, accessibility; connect to real API.
5. Frontend/backend tests, GitHub Actions, developer docs, architecture alignment; run and report checks.
6. Draft Render blueprint and deployment instructions; STOP before any deployment or external publishing.

At every checkpoint provide: files changed, commands run, actual results, issues, next action. Never claim tests passed unless executed. Do not use fake backend data for the real app. Use strict TypeScript, UTC-aware timestamps, UUID task IDs and environment-based secrets. Keep code approachable for students.
