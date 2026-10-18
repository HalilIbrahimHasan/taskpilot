---
name: frontend-development
description: Implements TaskPilot React and TypeScript features against the live API. Use when changing frontend pages, components, routing, tables, charts, or API calls.
---

# Frontend Development

1. Read the API schema and reuse types in `src/types.ts`.
2. Put HTTP calls and error extraction in `src/lib/api.ts`.
3. Build reusable, accessible components and explicit async states.
4. Preserve responsive behavior and stable key selectors.
5. Add or update Vitest and Testing Library coverage.
6. Run `npm run lint`, `npm run typecheck`, `npm test -- --run`, and `npm run build`.

Do not add mocked application data or priority filtering.
