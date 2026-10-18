export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type TaskInput = {
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string | null;
};

export type TaskList = {
  items: Task[];
  total: number;
  limit: number;
  offset: number;
};

export type DashboardSummary = {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  overdue: number;
  by_priority: Record<TaskPriority, number>;
  recent_activity: Task[];
};

export type SortField = "created_at" | "updated_at" | "due_date" | "title" | "priority";
export type SortOrder = "asc" | "desc";
