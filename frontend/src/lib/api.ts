import axios from "axios";

import type {
  DashboardSummary,
  SortField,
  SortOrder,
  Task,
  TaskInput,
  TaskList,
  TaskStatus,
} from "../types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
  headers: {
    Accept: "application/json",
  },
});

export type HealthResponse = {
  status: "ok";
};

export async function getHealth(): Promise<HealthResponse> {
  const response = await api.get<HealthResponse>("/health");
  return response.data;
}

export type TaskQuery = {
  search?: string;
  status?: TaskStatus | "";
  sort_by?: SortField;
  sort_order?: SortOrder;
  limit?: number;
  offset?: number;
};

export async function listTasks(query: TaskQuery): Promise<TaskList> {
  const params = Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== "" && value !== undefined),
  );
  const response = await api.get<TaskList>("/api/v1/tasks", { params });
  return response.data;
}

export async function getTask(taskId: string): Promise<Task> {
  const response = await api.get<Task>(`/api/v1/tasks/${taskId}`);
  return response.data;
}

export async function createTask(input: TaskInput): Promise<Task> {
  const response = await api.post<Task>("/api/v1/tasks", input);
  return response.data;
}

export async function updateTask(taskId: string, input: Partial<TaskInput>): Promise<Task> {
  const response = await api.patch<Task>(`/api/v1/tasks/${taskId}`, input);
  return response.data;
}

export async function deleteTask(taskId: string): Promise<void> {
  await api.delete(`/api/v1/tasks/${taskId}`);
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get<DashboardSummary>("/api/v1/dashboard/summary");
  return response.data;
}

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error?.message;
    if (typeof message === "string") return message;
    if (error.code === "ERR_NETWORK") return "Unable to connect to the TaskPilot API.";
  }
  return "Something went wrong. Please try again.";
}

export function getApiFieldErrors(error: unknown): Record<string, string> {
  if (!axios.isAxiosError(error)) return {};
  const details = error.response?.data?.error?.details;
  if (!Array.isArray(details)) return {};

  const fields: Record<string, string> = {};
  for (const detail of details) {
    const path = Array.isArray(detail?.loc) ? detail.loc : [];
    const field = String(path.at(-1) ?? "");
    if (field && typeof detail?.msg === "string") {
      fields[field] = detail.msg;
    }
  }
  return fields;
}
