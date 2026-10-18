import { CalendarDays, LoaderCircle, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { getApiError, getApiFieldErrors } from "../lib/api";
import { formatDate, formatDateTime } from "../lib/utils";
import type { Task, TaskInput, TaskPriority, TaskStatus } from "../types";
import { PriorityBadge, StatusBadge } from "./ui/Badge";
import { Button } from "./ui/Button";

type DialogMode = "create" | "view" | "edit";

type TaskDialogProps = {
  mode: DialogMode;
  task: Task | null;
  onClose: () => void;
  onEdit: () => void;
  onSubmit: (input: TaskInput) => Promise<void>;
};

const initialInput: TaskInput = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  due_date: "",
};

export function TaskDialog({ mode, task, onClose, onEdit, onSubmit }: TaskDialogProps) {
  const [input, setInput] = useState<TaskInput>(initialInput);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setInput(
      task
        ? {
            title: task.title,
            description: task.description ?? "",
            status: task.status,
            priority: task.priority,
            due_date: task.due_date ?? "",
          }
        : initialInput,
    );
    setError("");
    setFieldErrors({});
  }, [task, mode]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setFieldErrors({});
    try {
      await onSubmit({
        ...input,
        description: input.description || null,
        due_date: input.due_date || null,
      });
    } catch (requestError) {
      setError(getApiError(requestError));
      setFieldErrors(getApiFieldErrors(requestError));
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "create" ? "Create task" : mode === "edit" ? "Edit task" : "Task details";

  return (
    <div
      aria-labelledby="task-dialog-title"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-end bg-slate-950/45 p-0 backdrop-blur-sm sm:place-items-center sm:p-6"
      role="dialog"
    >
      <div className="max-h-[94vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
              TaskPilot
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950" id="task-dialog-title">
              {title}
            </h2>
          </div>
          <Button aria-label="Close dialog" onClick={onClose} size="icon" variant="ghost">
            <X aria-hidden="true" className="size-5" />
          </Button>
        </div>

        {mode === "view" && task ? (
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-slate-950">{task.title}</h3>
            <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
              {task.description || "No description provided."}
            </p>
            <dl className="mt-8 grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Due date
                </dt>
                <dd className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <CalendarDays aria-hidden="true" className="size-4 text-slate-400" />
                  {formatDate(task.due_date)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Task ID
                </dt>
                <dd className="mt-1 truncate font-mono text-xs text-slate-600">{task.id}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Created
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  {formatDateTime(task.created_at)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Updated
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  {formatDateTime(task.updated_at)}
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex justify-end gap-3">
              <Button onClick={onClose} variant="secondary">Close</Button>
              <Button onClick={onEdit}>Edit task</Button>
            </div>
          </div>
        ) : (
          <form data-testid="task-form" onSubmit={(event) => void handleSubmit(event)}>
            <div className="space-y-5 p-6">
              <Field label="Title" required>
                <input
                  autoFocus
                  className="form-control"
                  maxLength={120}
                  onChange={(event) => setInput({ ...input, title: event.target.value })}
                  placeholder="What needs to be done?"
                  required
                  value={input.title}
                />
                {fieldErrors.title && (
                  <p className="mt-2 text-sm font-medium text-rose-700" role="alert">
                    {fieldErrors.title}
                  </p>
                )}
              </Field>
              <Field label="Description">
                <textarea
                  className="form-control min-h-28 resize-y"
                  maxLength={2000}
                  onChange={(event) => setInput({ ...input, description: event.target.value })}
                  placeholder="Add useful context for this task"
                  value={input.description ?? ""}
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Status">
                  <select
                    className="form-control"
                    onChange={(event) =>
                      setInput({ ...input, status: event.target.value as TaskStatus })
                    }
                    value={input.status}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </Field>
                <Field label="Priority">
                  <select
                    className="form-control"
                    onChange={(event) =>
                      setInput({ ...input, priority: event.target.value as TaskPriority })
                    }
                    value={input.priority}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </Field>
                <Field label="Due date">
                  <input
                    className="form-control"
                    onChange={(event) => setInput({ ...input, due_date: event.target.value })}
                    type="date"
                    value={input.due_date ?? ""}
                  />
                </Field>
              </div>
              {error && (
                <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">
                  {error}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-3 border-t bg-slate-50 px-6 py-4">
              <Button disabled={saving} onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button data-testid="save-task" disabled={saving} type="submit">
                {saving && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
                {saving ? "Saving…" : mode === "create" ? "Create task" : "Save changes"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-600">*</span>}
      </span>
      {children}
    </label>
  );
}
