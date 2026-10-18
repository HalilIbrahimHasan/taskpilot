---
name: test-case-generation
description: Generates focused TaskPilot backend and frontend tests from acceptance criteria. Use when adding behavior, fixing regressions, or improving coverage.
---

# Test Case Generation

1. Map each acceptance criterion to positive, negative, boundary, and persistence cases.
2. Prefer API integration tests with isolated sessions and UI tests by semantic role.
3. Keep dates deterministic or inject the reference clock.
4. Cover loading, empty, error, keyboard, and responsive behavior where relevant.
5. Include explicit guard tests for deferred stories.
6. Run the smallest relevant suite, then the full local verification.

Output test names, requirement IDs, and actual results.
