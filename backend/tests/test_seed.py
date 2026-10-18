from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.task import Task, TaskPriority, TaskStatus
from app.seed import seed_tasks


def test_seed_is_idempotent_and_covers_required_variants(session: Session) -> None:
    first = seed_tasks(session)
    second = seed_tasks(session)
    total = session.scalar(select(func.count()).select_from(Task))
    statuses = set(session.scalars(select(Task.status)))
    priorities = set(session.scalars(select(Task.priority)))
    due_dates = list(session.scalars(select(Task.due_date)))

    assert first == 36
    assert second == 36
    assert total == 36
    assert statuses == set(TaskStatus)
    assert priorities == set(TaskPriority)
    assert any(due_date is None for due_date in due_dates)
    assert any(due_date is not None for due_date in due_dates)
