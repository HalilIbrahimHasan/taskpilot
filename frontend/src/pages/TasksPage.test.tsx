import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { TasksPage } from "./TasksPage";

const listTasks = vi.fn();

vi.mock("../lib/api", () => ({
  listTasks: (...args: unknown[]) => listTasks(...args),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  getApiError: () => "Unable to load tasks",
}));

const sampleTask = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "Prepare product demo",
  description: "Walk through the dashboard",
  status: "pending",
  priority: "high",
  due_date: "2026-10-20",
  created_at: "2026-10-18T12:00:00Z",
  updated_at: "2026-10-18T12:00:00Z",
};

describe("TasksPage", () => {
  it("renders persisted tasks from the API", async () => {
    listTasks.mockResolvedValue({
      items: [sampleTask],
      total: 1,
      limit: 10,
      offset: 0,
    });

    render(
      <MemoryRouter>
        <TasksPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Prepare product demo")).toBeInTheDocument();
    expect(screen.getByTestId("search-tasks")).toBeInTheDocument();
    expect(screen.getByTestId("status-filter")).toBeInTheDocument();
    expect(screen.queryByLabelText(/filter by priority/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId("priority-filter")).not.toBeInTheDocument();
  });

  it("shows an empty state when no tasks match", async () => {
    listTasks.mockResolvedValue({
      items: [],
      total: 0,
      limit: 10,
      offset: 0,
    });

    render(
      <MemoryRouter>
        <TasksPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("No tasks yet")).toBeInTheDocument();
  });
});
