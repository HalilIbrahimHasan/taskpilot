import uuid
from typing import Literal

from sqlalchemy import Select, case, func, or_, select
from sqlalchemy.orm import Session

from app.models.task import Task, TaskPriority, TaskStatus

SortField = Literal["created_at", "updated_at", "due_date", "title", "priority"]
SortOrder = Literal["asc", "desc"]


class TaskRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def list(
        self,
        *,
        search: str | None,
        status: TaskStatus | None,
        sort_by: SortField,
        sort_order: SortOrder,
        limit: int,
        offset: int,
    ) -> tuple[list[Task], int]:
        query: Select[tuple[Task]] = select(Task)
        count_query = select(func.count()).select_from(Task)

        if search:
            pattern = f"%{search.strip()}%"
            search_filter = or_(Task.title.ilike(pattern), Task.description.ilike(pattern))
            query = query.where(search_filter)
            count_query = count_query.where(search_filter)
        if status:
            query = query.where(Task.status == status)
            count_query = count_query.where(Task.status == status)

        if sort_by == "priority":
            sort_column = case(
                (Task.priority == TaskPriority.low, 1),
                (Task.priority == TaskPriority.medium, 2),
                (Task.priority == TaskPriority.high, 3),
            )
        else:
            sort_column = getattr(Task, sort_by)

        ordering = sort_column.asc() if sort_order == "asc" else sort_column.desc()
        query = query.order_by(ordering, Task.id.asc()).limit(limit).offset(offset)

        return list(self.session.scalars(query)), self.session.scalar(count_query) or 0

    def get(self, task_id: uuid.UUID) -> Task | None:
        return self.session.get(Task, task_id)

    def add(self, task: Task) -> Task:
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def save(self, task: Task) -> Task:
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def delete(self, task: Task) -> None:
        self.session.delete(task)
        self.session.commit()
