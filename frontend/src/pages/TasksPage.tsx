import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { EmptyState, ErrorState, LoadingState } from "../components/PageState";
import { TaskDialog } from "../components/TaskDialog";
import { PriorityBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import {
  createTask,
  deleteTask,
  getApiError,
  listTasks,
  updateTask,
  type TaskQuery,
} from "../lib/api";
import { useDebouncedValue } from "../lib/hooks";
import { cn, formatDate, isOverdue } from "../lib/utils";
import type { SortField, SortOrder, Task, TaskInput, TaskStatus } from "../types";

const columnHelper = createColumnHelper<Task>();
const pageSize = 10;

type DialogState = { mode: "create" | "view" | "edit"; task: Task | null } | null;

export function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<TaskQuery>({
    search: "",
    status: "",
    sort_by: "updated_at",
    sort_order: "desc",
    limit: pageSize,
    offset: 0,
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialog, setDialog] = useState<DialogState>(null);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listTasks(query);
      setTasks(result.items);
      setTotal(result.total);
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    setQuery((current) =>
      current.search === debouncedSearch ? current : { ...current, search: debouncedSearch, offset: 0 },
    );
  }, [debouncedSearch]);

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setDialog({ mode: "create", task: null });
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  async function saveTask(input: TaskInput) {
    if (dialog?.mode === "edit" && dialog.task) {
      await updateTask(dialog.task.id, input);
    } else {
      await createTask(input);
    }
    setDialog(null);
    await loadTasks();
  }

  async function changeStatus(task: Task, status: TaskStatus) {
    try {
      await updateTask(task.id, { status });
      await loadTasks();
    } catch (requestError) {
      setError(getApiError(requestError));
    }
  }

  async function removeTask(task: Task) {
    if (!window.confirm(`Delete “${task.title}”? This action cannot be undone.`)) return;
    try {
      await deleteTask(task.id);
      await loadTasks();
    } catch (requestError) {
      setError(getApiError(requestError));
    }
  }

  const columns = [
      columnHelper.accessor("title", {
        header: "Task",
        cell: ({ row }) => (
          <Link
            className="block max-w-xs text-left font-semibold text-slate-900 hover:text-indigo-700 hover:underline"
            to={`/tasks/${row.original.id}`}
          >
            <span className="line-clamp-1">{row.original.title}</span>
            <span className="mt-1 line-clamp-1 text-xs font-normal text-slate-500">
              {row.original.description || "No description"}
            </span>
          </Link>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => (
          <select
            aria-label={`Change status for ${row.original.title}`}
            className="rounded-lg border-0 bg-transparent py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-indigo-500"
            onChange={(event) =>
              void changeStatus(row.original, event.target.value as TaskStatus)
            }
            value={row.original.status}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        ),
      }),
      columnHelper.accessor("priority", {
        header: "Priority",
        cell: ({ getValue }) => <PriorityBadge priority={getValue()} />,
      }),
      columnHelper.accessor("due_date", {
        header: "Due date",
        cell: ({ row }) => (
          <span
            className={cn(
              "whitespace-nowrap text-sm text-slate-600",
              isOverdue(row.original.due_date, row.original.status) && "font-semibold text-rose-600",
            )}
          >
            {formatDate(row.original.due_date)}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Link
              aria-label={`View ${row.original.title}`}
              className="inline-flex size-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              to={`/tasks/${row.original.id}`}
            >
              <Eye aria-hidden="true" className="size-4" />
            </Link>
            <Button
              aria-label={`Edit ${row.original.title}`}
              onClick={() => setDialog({ mode: "edit", task: row.original })}
              size="icon"
              variant="ghost"
            >
              <Pencil aria-hidden="true" className="size-4" />
            </Button>
            <Button
              aria-label={`Delete ${row.original.title}`}
              data-testid={`delete-task-${row.original.id}`}
              onClick={() => void removeTask(row.original)}
              size="icon"
              variant="ghost"
            >
              <Trash2 aria-hidden="true" className="size-4 text-rose-600" />
            </Button>
          </div>
        ),
      }),
    ];

  const table = useReactTable({ data: tasks, columns, getCoreRowModel: getCoreRowModel() });
  const currentPage = Math.floor((query.offset ?? 0) / pageSize) + 1;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-indigo-600">Workspace</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Tasks</h1>
          <p className="mt-2 text-slate-500">Create, prioritize, and move work forward.</p>
        </div>
        <Button data-testid="create-task" onClick={() => setDialog({ mode: "create", task: null })}>
          <Plus aria-hidden="true" className="size-4" />
          Create task
        </Button>
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-card">
        <div className="grid gap-3 border-b p-4 md:grid-cols-[minmax(240px,1fr)_180px_220px]">
          <label className="relative">
            <span className="sr-only">Search tasks</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            />
            <input
              className="form-control pl-9"
              data-testid="search-tasks"
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search title or description"
              type="search"
              value={searchInput}
            />
          </label>
          <label>
            <span className="sr-only">Filter by status</span>
            <select
              className="form-control"
              data-testid="status-filter"
              onChange={(event) =>
                setQuery((current) => ({
                  ...current,
                  status: event.target.value as TaskStatus | "",
                  offset: 0,
                }))
              }
              value={query.status}
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label className="relative">
            <span className="sr-only">Sort tasks</span>
            <ArrowDownUp
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            />
            <select
              className="form-control pl-9"
              data-testid="sort-tasks"
              onChange={(event) => {
                const [sort_by, sort_order] = event.target.value.split(":") as [
                  SortField,
                  SortOrder,
                ];
                setQuery((current) => ({ ...current, sort_by, sort_order, offset: 0 }));
              }}
              value={`${query.sort_by}:${query.sort_order}`}
            >
              <option value="updated_at:desc">Recently updated</option>
              <option value="created_at:desc">Newest created</option>
              <option value="due_date:asc">Due date</option>
              <option value="title:asc">Title A–Z</option>
              <option value="priority:desc">Highest priority</option>
            </select>
          </label>
        </div>

        {error ? (
          <div className="p-6">
            <ErrorState message={error} onRetry={() => void loadTasks()} />
          </div>
        ) : loading ? (
          <LoadingState label="Loading tasks…" />
        ) : tasks.length === 0 ? (
          <EmptyState
            action={
              <Button onClick={() => setDialog({ mode: "create", task: null })}>
                <Plus aria-hidden="true" className="size-4" />
                Create task
              </Button>
            }
            description={
              query.search || query.status
                ? "Try changing your search or status filter."
                : "Create your first task to start tracking progress."
            }
            title={query.search || query.status ? "No matching tasks" : "No tasks yet"}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr className="bg-slate-50/80" key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 last:text-right"
                          key={header.id}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y">
                  {table.getRowModel().rows.map((row) => (
                    <tr className="transition hover:bg-slate-50/70" key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td className="px-5 py-4 align-middle" key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Showing {(query.offset ?? 0) + 1}–{Math.min((query.offset ?? 0) + pageSize, total)} of{" "}
                {total} tasks
              </p>
              <div className="flex items-center gap-2">
                <Button
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setQuery((current) => ({
                      ...current,
                      offset: Math.max(0, (current.offset ?? 0) - pageSize),
                    }))
                  }
                  size="icon"
                  variant="secondary"
                >
                  <ChevronLeft aria-hidden="true" className="size-4" />
                </Button>
                <span className="px-2 text-sm font-semibold text-slate-700">
                  {currentPage} / {pageCount}
                </span>
                <Button
                  aria-label="Next page"
                  disabled={currentPage >= pageCount}
                  onClick={() =>
                    setQuery((current) => ({
                      ...current,
                      offset: (current.offset ?? 0) + pageSize,
                    }))
                  }
                  size="icon"
                  variant="secondary"
                >
                  <ChevronRight aria-hidden="true" className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </section>

      {dialog && (
        <TaskDialog
          mode={dialog.mode}
          onClose={() => setDialog(null)}
          onEdit={() =>
            setDialog((current) =>
              current?.task ? { mode: "edit", task: current.task } : current,
            )
          }
          onSubmit={saveTask}
          task={dialog.task}
        />
      )}
    </main>
  );
}
