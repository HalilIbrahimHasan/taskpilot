from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.dashboard import DashboardSummary
from app.services.dashboard import DashboardService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary, summary="Get dashboard metrics")
def dashboard_summary(session: Annotated[Session, Depends(get_db)]) -> DashboardSummary:
    return DashboardService(session).summary()
