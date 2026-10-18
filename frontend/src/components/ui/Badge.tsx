import type { ReactNode } from "react";

import { cn } from "../../lib/utils";
import type { TaskPriority, TaskStatus } from "../../types";

export function StatusBadge({ status }: { status: TaskStatus }) {
  const labels: Record<TaskStatus, string> = {
    pending: "Pending",
    in_progress: "In progress",
    completed: "Completed",
  };
  return (
    <Badge
      className={cn(
        status === "pending" && "bg-amber-50 text-amber-700 ring-amber-600/20",
        status === "in_progress" && "bg-blue-50 text-blue-700 ring-blue-600/20",
        status === "completed" && "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
      )}
    >
      {labels[status]}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <Badge
      className={cn(
        priority === "low" && "bg-slate-100 text-slate-700 ring-slate-500/20",
        priority === "medium" && "bg-violet-50 text-violet-700 ring-violet-600/20",
        priority === "high" && "bg-rose-50 text-rose-700 ring-rose-600/20",
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        className,
      )}
    >
      {children}
    </span>
  );
}
