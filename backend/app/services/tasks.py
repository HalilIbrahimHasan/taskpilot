import uuid

from fastapi import HTTPException, status

from app.models.task import Task, TaskStatus, utc_now
from app.repositories.tasks import SortField, SortOrder, TaskRepository
from app.schemas.task import TaskCreate, TaskList, TaskRead, TaskUpdate


class TaskService:
    def __init__(self, repository: TaskRepository) -> None:
        self.repository = repository

    def list(
        self,
        *,
        search: str | None,
        status_filter: TaskStatus | None,
        sort_by: SortField,
        sort_order: SortOrder,
        limit: int,
        offset: int,
    ) -> TaskList:
        tasks, total = self.repository.list(
            search=search,
            status=status_filter,
            sort_by=sort_by,
            sort_order=sort_order,
            limit=limit,
            offset=offset,
        )
        return TaskList(
            items=[TaskRead.model_validate(task) for task in tasks],
            total=total,
            limit=limit,
            offset=offset,
        )

    def get(self, task_id: uuid.UUID) -> Task:
        task = self.repository.get(task_id)
        if task is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        return task

    def create(self, data: TaskCreate) -> Task:
        return self.repository.add(Task(**data.model_dump()))

    def update(self, task_id: uuid.UUID, data: TaskUpdate) -> Task:
        task = self.get(task_id)
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(task, field, value)
        task.updated_at = utc_now()
        return self.repository.save(task)

    def delete(self, task_id: uuid.UUID) -> None:
        self.repository.delete(self.get(task_id))
