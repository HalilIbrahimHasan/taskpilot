import {
  AlertCircle,
  CheckCircle2,
  CircleDashed,
  ListChecks,
  Timer,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ErrorState, LoadingState } from "../components/PageState";
import { PriorityBadge, StatusBadge } from "../components/ui/Badge";
import { getApiError, getDashboardSummary } from "../lib/api";
import { formatRelativeTime } from "../lib/utils";
import type { DashboardSummary } from "../types";

const chartColors = ["#64748b", "#7c3aed", "#e11d48"];

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState("");

  const loadSummary = useCallback(async () => {
    setError("");
    try {
      setSummary(await getDashboardSummary());
    } catch (requestError) {
      setError(getApiError(requestError));
    }
  }, []);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  if (error) {
    return (
      <Page>
        <ErrorState message={error} onRetry={() => void loadSummary()} />
      </Page>
    );
  }
  if (!summary) return <Page><LoadingState label="Loading dashboard…" /></Page>;

  const kpis = [
    { label: "Total tasks", value: summary.total, icon: ListChecks, color: "text-indigo-600" },
    { label: "Pending", value: summary.pending, icon: CircleDashed, color: "text-amber-600" },
    { label: "In progress", value: summary.in_progress, icon: Timer, color: "text-blue-600" },
    { label: "Completed", value: summary.completed, icon: CheckCircle2, color: "text-emerald-600" },
    { label: "Overdue", value: summary.overdue, icon: AlertCircle, color: "text-rose-600" },
  ];
  const priorityData = [
    { name: "Low", value: summary.by_priority.low },
    { name: "Medium", value: summary.by_priority.medium },
    { name: "High", value: summary.by_priority.high },
  ];
  const statusData = [
    { name: "Pending", tasks: summary.pending },
    { name: "In progress", tasks: summary.in_progress },
    { name: "Completed", tasks: summary.completed },
  ];

  return (
    <Page>
      <div>
        <p className="text-sm font-semibold text-indigo-600">Overview</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Dashboard</h1>
        <p className="mt-2 text-slate-500">A live view of progress across your workspace.</p>
      </div>

      <section aria-label="Task metrics" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((item) => (
          <article className="rounded-2xl border bg-white p-5 shadow-card" key={item.label}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <item.icon aria-hidden="true" className={`size-5 ${item.color}`} />
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Status distribution" description="Tasks at each stage of delivery">
          <ResponsiveContainer height={260} width="100%">
            <BarChart data={statusData} margin={{ left: -24, right: 8, top: 12 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
              <XAxis axisLine={false} dataKey="name" fontSize={12} tickLine={false} />
              <YAxis allowDecimals={false} axisLine={false} fontSize={12} tickLine={false} />
              <Tooltip cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="tasks" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Priority mix" description="Current workload by priority">
          <div className="grid items-center sm:grid-cols-[1fr_160px]">
            <ResponsiveContainer height={260} width="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  dataKey="value"
                  innerRadius={62}
                  outerRadius={95}
                  paddingAngle={4}
                  strokeWidth={0}
                >
                  {priorityData.map((entry, index) => (
                    <Cell fill={chartColors[index]} key={entry.name} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {priorityData.map((item, index) => (
                <div className="flex items-center justify-between gap-5 text-sm" key={item.name}>
                  <span className="flex items-center gap-2 text-slate-600">
                    <span
                      aria-hidden="true"
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: chartColors[index] }}
                    />
                    {item.name}
                  </span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </section>

      <section className="mt-6 rounded-2xl border bg-white shadow-card">
        <div className="border-b px-6 py-5">
          <h2 className="text-lg font-bold text-slate-950">Recent activity</h2>
          <p className="mt-1 text-sm text-slate-500">Tasks most recently updated</p>
        </div>
        <div className="divide-y">
          {summary.recent_activity.length === 0 ? (
            <p className="px-6 py-10 text-sm text-slate-500">No task activity yet.</p>
          ) : (
            summary.recent_activity.map((task) => (
              <div
                className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                key={task.id}
              >
                <div className="min-w-0">
                  <Link
                    className="block truncate font-semibold text-slate-900 hover:text-indigo-700 hover:underline"
                    to={`/tasks/${task.id}`}
                  >
                    {task.title}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500">
                    Updated {formatRelativeTime(task.updated_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </Page>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">{children}</main>;
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border bg-white p-6 shadow-card">
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <div className="mt-4">{children}</div>
    </article>
  );
}
