from datetime import date, timedelta

from fastapi.testclient import TestClient


def create_task(client: TestClient, **overrides: object) -> dict[str, object]:
    payload: dict[str, object] = {
        "title": "Build workshop demo",
        "description": "Create a complete vertical slice",
        "status": "pending",
        "priority": "high",
        "due_date": date.today().isoformat(),
    }
    payload.update(overrides)
    response = client.post("/api/v1/tasks", json=payload)
    assert response.status_code == 201
    return response.json()


def test_task_crud(client: TestClient) -> None:
    task = create_task(client)

    fetched = client.get(f"/api/v1/tasks/{task['id']}")
    assert fetched.status_code == 200
    assert fetched.json()["title"] == "Build workshop demo"

    updated = client.patch(
        f"/api/v1/tasks/{task['id']}",
        json={"status": "completed", "title": "Demo complete"},
    )
    assert updated.status_code == 200
    assert updated.json()["status"] == "completed"

    deleted = client.delete(f"/api/v1/tasks/{task['id']}")
    assert deleted.status_code == 204
    assert client.get(f"/api/v1/tasks/{task['id']}").status_code == 404


def test_list_search_filter_sort_and_pagination(client: TestClient) -> None:
    create_task(client, title="Alpha task", status="pending", priority="low")
    create_task(client, title="Beta task", status="completed", priority="high")
    create_task(client, title="Alpha follow-up", status="pending", priority="medium")

    response = client.get(
        "/api/v1/tasks",
        params={
            "search": "Alpha",
            "status": "pending",
            "sort_by": "title",
            "sort_order": "asc",
            "limit": 1,
            "offset": 0,
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 2
    assert body["limit"] == 1
    assert body["items"][0]["title"] == "Alpha follow-up"


def test_unknown_task_returns_404(client: TestClient) -> None:
    response = client.get("/api/v1/tasks/11111111-1111-1111-1111-111111111111")

    assert response.status_code == 404
    assert response.json()["error"]["code"] == "not_found"


def test_validation_and_uuid_errors_are_structured(client: TestClient) -> None:
    invalid_title = client.post("/api/v1/tasks", json={"title": "   "})
    malformed_id = client.get("/api/v1/tasks/not-a-uuid")

    assert invalid_title.status_code == 422
    assert invalid_title.json()["error"]["code"] == "validation_error"
    assert invalid_title.json()["error"]["details"][0]["loc"][-1] == "title"
    assert malformed_id.status_code == 422


def test_past_due_date_is_allowed(client: TestClient) -> None:
    response = client.post(
        "/api/v1/tasks",
        json={
            "title": "Document an existing overdue item",
            "due_date": (date.today() - timedelta(days=2)).isoformat(),
        },
    )

    assert response.status_code == 201


def test_priority_filter_is_not_exposed(client: TestClient) -> None:
    create_task(client, priority="low")
    create_task(client, title="High priority", priority="high")

    response = client.get("/api/v1/tasks", params={"priority": "high"})

    assert response.status_code == 200
    assert response.json()["total"] == 2
