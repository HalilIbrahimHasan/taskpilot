from fastapi.testclient import TestClient

from app.main import app


def test_health_check() -> None:
    response = TestClient(app).get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_openapi_includes_required_endpoints() -> None:
    response = TestClient(app).get("/openapi.json")

    assert response.status_code == 200
    paths = response.json()["paths"]
    assert "/health" in paths
    assert "/api/v1/tasks" in paths
    assert "/api/v1/tasks/{task_id}" in paths
    assert "/api/v1/dashboard/summary" in paths

    list_params = [param["name"] for param in paths["/api/v1/tasks"]["get"].get("parameters", [])]
    assert "search" in list_params
    assert "status" in list_params
    assert "sort_by" in list_params
    assert "priority" not in list_params
