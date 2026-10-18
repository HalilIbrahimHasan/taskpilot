import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import App from "./App";

vi.mock("./lib/api", () => ({
  getDashboardSummary: vi.fn().mockResolvedValue({
    total: 3,
    pending: 1,
    in_progress: 1,
    completed: 1,
    overdue: 0,
    by_priority: { low: 1, medium: 1, high: 1 },
    recent_activity: [],
  }),
}));

describe("App", () => {
  it("renders the live dashboard", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Total tasks")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
