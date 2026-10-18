import uuid
from datetime import UTC, datetime, time, timedelta

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.task import Task, TaskPriority, TaskStatus

NAMESPACE = uuid.UUID("4c87a924-f381-4b8c-87fd-d42920f7b44f")
TITLES = [
    "Prepare quarterly planning notes",
    "Review customer onboarding flow",
    "Update API documentation",
    "Design dashboard empty state",
    "Resolve mobile navigation issue",
    "Draft release announcement",
    "Audit accessibility labels",
    "Create database backup guide",
    "Refine task search experience",
    "Verify production health checks",
    "Plan sprint retrospective",
    "Review analytics requirements",
    "Update component library",
    "Test keyboard navigation",
    "Document local setup",
    "Optimize dashboard queries",
    "Confirm stakeholder feedback",
    "Prepare workshop exercises",
    "Review pull request checklist",
    "Create incident response notes",
    "Improve form validation copy",
    "Verify seed data coverage",
    "Map API error responses",
    "Polish task detail layout",
    "Review dependency updates",
    "Create deployment checklist",
    "Test pagination boundaries",
    "Validate UTC date handling",
    "Prepare product demo",
    "Organize architecture diagrams",
    "Review test coverage report",
    "Improve loading states",
    "Document sorting behavior",
    "Triage usability feedback",
    "Finalize release candidate",
    "Share weekly progress summary",
]


def seed_tasks(session: Session | None = None) -> int:
    today = datetime.now(UTC).date()
    statuses = list(TaskStatus)
    priorities = list(TaskPriority)
    owns_session = session is None
    if session is None:
        session = SessionLocal()

    try:
        for index, title in enumerate(TITLES):
            task_id = uuid.uuid5(NAMESPACE, f"task-{index + 1:02d}")
            created_date = today - timedelta(days=35 - index)
            timestamp = datetime.combine(created_date, time(hour=12), tzinfo=UTC)
            values = {
                "title": title,
                "description": (
                    f"Workshop seed task {index + 1:02d}. "
                    "This deterministic record supports UI and API demonstrations."
                ),
                "status": statuses[index % len(statuses)],
                "priority": priorities[(index * 2) % len(priorities)],
                "due_date": None if index % 7 == 0 else today + timedelta(days=(index % 18) - 8),
                "created_at": timestamp,
                "updated_at": timestamp + timedelta(hours=index % 6),
            }
            task = session.get(Task, task_id)
            if task is None:
                session.add(Task(id=task_id, **values))
            else:
                for field, value in values.items():
                    setattr(task, field, value)
        session.commit()
    finally:
        if owns_session:
            session.close()

    return len(TITLES)


if __name__ == "__main__":
    count = seed_tasks()
    print(f"Seeded {count} deterministic tasks.")
