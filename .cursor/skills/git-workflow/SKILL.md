---
name: git-workflow
description: Applies a safe, reviewable Git workflow for TaskPilot. Use for branches, commits, pull requests, or repository setup.
---

# Git Workflow

- Inspect repository state before acting.
- Keep feature changes small and separate unrelated cleanup.
- Never discard user changes or use destructive reset commands.
- Run relevant checks before proposing a commit.
- Use concise imperative commit subjects and explain behavior in the body when needed.
- Link requirements and report untracked or generated files.
- Never push, publish, create a remote, or merge without explicit approval.

Output changed files, verification results, and the proposed next Git action.
