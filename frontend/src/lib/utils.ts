import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { TaskPriority, TaskStatus } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatStatus(status: TaskStatus): string {
  return status === "in_progress"
    ? "In progress"
    : status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatPriority(priority: TaskPriority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

export function formatDate(value: string | null): string {
  if (!value) return "No due date";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function formatRelativeTime(value: string): string {
  const date = new Date(value);
  const difference = date.getTime() - Date.now();
  const days = Math.round(difference / 86_400_000);
  if (Math.abs(days) >= 1) {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(days, "day");
  }
  const hours = Math.round(difference / 3_600_000);
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(hours, "hour");
}

export function isOverdue(dueDate: string | null, status: TaskStatus): boolean {
  if (!dueDate || status === "completed") return false;
  return dueDate < new Date().toISOString().slice(0, 10);
}
