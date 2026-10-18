import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { TaskDetailPage } from "./TaskDetailPage";

const getTask = vi.fn();

vi.mock("../lib/api", () => ({
  getTask: (...args: unknown[]) => getTask(...args),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  getApiError: () => "Task not found",
}));

describe("TaskDetailPage", () => {
  it("renders task details from the API", async () => {
    getTask.mockResolvedValue({
      id: "11111111-1111-4111-8111-111111111111",
      title: "Prepare product demo",
      description: "Walk through the dashboard",
      status: "in_progress",
      priority: "medium",
      due_date: "2026-10-20",
      created_at: "2026-10-18T12:00:00Z",
      updated_at: "2026-10-18T13:00:00Z",
    });

    render(
      <MemoryRouter initialEntries={["/tasks/11111111-1111-4111-8111-111111111111"]}>
        <Routes>
          <Route element={<TaskDetailPage />} path="/tasks/:taskId" />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "Prepare product demo" })).toBeInTheDocument();
    expect(screen.getByText("Walk through the dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("task-status")).toHaveValue("in_progress");
  });
});
