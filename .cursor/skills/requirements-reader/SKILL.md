---
name: requirements-reader
description: Reads TaskPilot requirements and identifies acceptance criteria, deferred scope, and affected layers. Use before product behavior changes.
---

# Requirements Reader

1. Read `AGENTS.md`, `docs/requirements/PRODUCT_REQUIREMENTS.md`, and traceability.
2. Extract the requested acceptance criteria and nonfunctional constraints.
3. Flag STORY-A and STORY-B unless explicitly approved.
4. Map each requirement to database, API, UI, test, and documentation work.

Output a concise scope summary and affected-file list. Verify every implemented behavior
has a requirement and every deferred behavior remains absent.
