from collections.abc import Callable
from datetime import UTC, date, datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.task import Task, TaskPriority, TaskStatus
from app.schemas.dashboard import DashboardSummary, PriorityBreakdown
from app.schemas.task import TaskRead


def utc_today() -> date:
    return datetime.now(UTC).date()


class DashboardService:
    def __init__(self, session: Session, today_provider: Callable[[], date] = utc_today) -> None:
        self.session = session
        self.today_provider = today_provider

    def summary(self) -> DashboardSummary:
        status_rows = self.session.execute(
            select(Task.status, func.count(Task.id)).group_by(Task.status)
        ).all()
        priority_rows = self.session.execute(
            select(Task.priority, func.count(Task.id)).group_by(Task.priority)
        ).all()
        status_counts = {status: count for status, count in status_rows}
        priority_counts = {priority: count for priority, count in priority_rows}
        total = self.session.scalar(select(func.count()).select_from(Task)) or 0
        overdue = (
            self.session.scalar(
                select(func.count())
                .select_from(Task)
                .where(
                    Task.due_date < self.today_provider(),
                    Task.status != TaskStatus.completed,
                )
            )
            or 0
        )
        recent = list(
            self.session.scalars(
                select(Task).order_by(Task.updated_at.desc(), Task.id.asc()).limit(5)
            )
        )

        return DashboardSummary(
            total=total,
            pending=status_counts.get(TaskStatus.pending, 0),
            in_progress=status_counts.get(TaskStatus.in_progress, 0),
            completed=status_counts.get(TaskStatus.completed, 0),
            overdue=overdue,
            by_priority=PriorityBreakdown(
                low=priority_counts.get(TaskPriority.low, 0),
                medium=priority_counts.get(TaskPriority.medium, 0),
                high=priority_counts.get(TaskPriority.high, 0),
            ),
            recent_activity=[TaskRead.model_validate(task) for task in recent],
        )
