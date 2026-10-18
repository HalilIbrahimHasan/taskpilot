.PHONY: install dev backend frontend db-up migrate seed test lint typecheck

install:
	cd backend && python3 -m venv .venv && .venv/bin/pip install -e ".[dev]"
	cd frontend && npm install

dev:
	@echo "Run 'make backend' and 'make frontend' in separate terminals."

backend:
	cd backend && .venv/bin/uvicorn app.main:app --reload --port 8000

frontend:
	cd frontend && npm run dev

db-up:
	docker compose up -d postgres

migrate:
	cd backend && .venv/bin/alembic upgrade head

seed:
	cd backend && .venv/bin/python -m app.seed

test:
	cd backend && .venv/bin/pytest
	cd frontend && npm test -- --run

lint:
	cd backend && .venv/bin/ruff check .
	cd frontend && npm run lint

typecheck:
	cd frontend && npm run typecheck
