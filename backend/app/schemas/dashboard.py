from pydantic import BaseModel

from app.schemas.task import TaskRead


class PriorityBreakdown(BaseModel):
    low: int
    medium: int
    high: int


class DashboardSummary(BaseModel):
    total: int
    pending: int
    in_progress: int
    completed: int
    overdue: int
    by_priority: PriorityBreakdown
    recent_activity: list[TaskRead]
