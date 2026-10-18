import uuid
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.task import TaskStatus
from app.repositories.tasks import TaskRepository
from app.schemas.task import TaskCreate, TaskList, TaskRead, TaskUpdate
from app.services.tasks import TaskService

router = APIRouter(prefix="/tasks", tags=["tasks"])


def get_service(session: Annotated[Session, Depends(get_db)]) -> TaskService:
    return TaskService(TaskRepository(session))


@router.get("", response_model=TaskList, summary="List and search tasks")
def list_tasks(
    service: Annotated[TaskService, Depends(get_service)],
    search: Annotated[str | None, Query(max_length=120)] = None,
    status_filter: Annotated[TaskStatus | None, Query(alias="status")] = None,
    sort_by: Annotated[
        Literal["created_at", "updated_at", "due_date", "title", "priority"], Query()
    ] = "updated_at",
    sort_order: Annotated[Literal["asc", "desc"], Query()] = "desc",
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> TaskList:
    return service.list(
        search=search,
        status_filter=status_filter,
        sort_by=sort_by,
        sort_order=sort_order,
        limit=limit,
        offset=offset,
    )


@router.post(
    "",
    response_model=TaskRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a task",
)
def create_task(
    data: TaskCreate,
    service: Annotated[TaskService, Depends(get_service)],
) -> TaskRead:
    return TaskRead.model_validate(service.create(data))


@router.get("/{task_id}", response_model=TaskRead, summary="Get task details")
def get_task(
    task_id: uuid.UUID,
    service: Annotated[TaskService, Depends(get_service)],
) -> TaskRead:
    return TaskRead.model_validate(service.get(task_id))


@router.patch("/{task_id}", response_model=TaskRead, summary="Update a task")
def update_task(
    task_id: uuid.UUID,
    data: TaskUpdate,
    service: Annotated[TaskService, Depends(get_service)],
) -> TaskRead:
    return TaskRead.model_validate(service.update(task_id, data))


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a task")
def delete_task(
    task_id: uuid.UUID,
    service: Annotated[TaskService, Depends(get_service)],
) -> Response:
    service.delete(task_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
