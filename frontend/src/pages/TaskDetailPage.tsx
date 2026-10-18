import { ArrowLeft, CalendarDays, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ErrorState, LoadingState } from "../components/PageState";
import { TaskDialog } from "../components/TaskDialog";
import { PriorityBadge, StatusBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { deleteTask, getApiError, getTask, updateTask } from "../lib/api";
import { formatDate, formatDateTime } from "../lib/utils";
import type { Task, TaskInput, TaskStatus } from "../types";

export function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  const loadTask = useCallback(async () => {
    if (!taskId) return;
    setError("");
    try {
      setTask(await getTask(taskId));
    } catch (requestError) {
      setTask(null);
      setError(getApiError(requestError));
    }
  }, [taskId]);

  useEffect(() => {
    void loadTask();
  }, [loadTask]);

  async function saveTask(input: TaskInput) {
    if (!task) return;
    const updated = await updateTask(task.id, input);
    setTask(updated);
    setEditing(false);
  }

  async function changeStatus(status: TaskStatus) {
    if (!task) return;
    try {
      setTask(await updateTask(task.id, { status }));
    } catch (requestError) {
      setError(getApiError(requestError));
    }
  }

  async function removeTask() {
    if (!task) return;
    if (!window.confirm(`Delete “${task.title}”? This action cannot be undone.`)) return;
    try {
      await deleteTask(task.id);
      navigate("/tasks");
    } catch (requestError) {
      setError(getApiError(requestError));
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-10">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-700"
        to="/tasks"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to tasks
      </Link>

      {error && !task ? (
        <div className="mt-8">
          <ErrorState message={error} onRetry={() => void loadTask()} />
        </div>
      ) : !task ? (
        <LoadingState label="Loading task…" />
      ) : (
        <article className="mt-6 rounded-3xl border bg-white p-6 shadow-card sm:p-8">
          {error && (
            <p className="mb-5 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setEditing(true)} variant="secondary">
                <Pencil aria-hidden="true" className="size-4" />
                Edit
              </Button>
              <Button
                data-testid="delete-task-detail"
                onClick={() => void removeTask()}
                variant="danger"
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Delete
              </Button>
            </div>
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">{task.title}</h1>
          <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">
            {task.description || "No description provided."}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="rounded-2xl bg-slate-50 p-4">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </span>
              <select
                aria-label="Change task status"
                className="form-control"
                data-testid="task-status"
                onChange={(event) => void changeStatus(event.target.value as TaskStatus)}
                value={task.status}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Due date</p>
              <p className="mt-3 flex items-center gap-2 font-semibold text-slate-800">
                <CalendarDays aria-hidden="true" className="size-4 text-slate-400" />
                {formatDate(task.due_date)}
              </p>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 rounded-2xl border p-5 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Task ID</dt>
              <dd className="mt-2 truncate font-mono text-xs text-slate-600">{task.id}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Created</dt>
              <dd className="mt-2 text-sm font-semibold text-slate-800">
                {formatDateTime(task.created_at)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Updated</dt>
              <dd className="mt-2 text-sm font-semibold text-slate-800">
                {formatDateTime(task.updated_at)}
              </dd>
            </div>
          </dl>
        </article>
      )}

      {editing && task && (
        <TaskDialog
          mode="edit"
          onClose={() => setEditing(false)}
          onEdit={() => undefined}
          onSubmit={saveTask}
          task={task}
        />
      )}
    </main>
  );
}
