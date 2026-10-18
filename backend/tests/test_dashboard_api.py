from datetime import UTC, datetime, timedelta

from fastapi.testclient import TestClient


def test_dashboard_counts_and_recent_activity(client: TestClient) -> None:
    today = datetime.now(UTC).date()
    tasks = [
        {
            "title": "Overdue pending",
            "status": "pending",
            "priority": "high",
            "due_date": (today - timedelta(days=1)).isoformat(),
        },
        {
            "title": "Completed work",
            "status": "completed",
            "priority": "medium",
            "due_date": (today - timedelta(days=2)).isoformat(),
        },
        {
            "title": "Current work",
            "status": "in_progress",
            "priority": "low",
            "due_date": today.isoformat(),
        },
    ]
    for task in tasks:
        assert client.post("/api/v1/tasks", json=task).status_code == 201

    response = client.get("/api/v1/dashboard/summary")

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 3
    assert body["pending"] == 1
    assert body["in_progress"] == 1
    assert body["completed"] == 1
    assert body["overdue"] == 1
    assert body["by_priority"] == {"low": 1, "medium": 1, "high": 1}
    assert len(body["recent_activity"]) == 3
