import { ClipboardCheck, LayoutDashboard, ListTodo, Plus } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { cn } from "../lib/utils";
import { Button } from "./ui/Button";

const navigation = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/tasks", label: "Tasks", icon: ListTodo, end: false },
];

export function AppShell() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-slate-950 px-4 py-6 text-white lg:block">
        <NavLink className="flex items-center gap-3 px-2 text-lg font-bold" to="/">
          <span className="grid size-10 place-items-center rounded-xl bg-indigo-500">
            <ClipboardCheck aria-hidden="true" className="size-5" />
          </span>
          TaskPilot
        </NavLink>
        <nav aria-label="Primary navigation" className="mt-10 space-y-1">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                )
              }
              end={item.end}
              key={item.to}
              to={item.to}
            >
              <item.icon aria-hidden="true" className="size-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute inset-x-4 bottom-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-semibold">Keep work moving</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Capture the next task, choose a priority, and set a clear status.
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-8">
            <NavLink className="flex items-center gap-2 font-bold lg:hidden" to="/">
              <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-white">
                <ClipboardCheck aria-hidden="true" className="size-4" />
              </span>
              TaskPilot
            </NavLink>
            <div className="hidden lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Task management workspace
              </p>
            </div>
            <Button data-testid="header-create-task" onClick={() => navigate("/tasks?create=1")}>
              <Plus aria-hidden="true" className="size-4" />
              New task
            </Button>
          </div>
          <nav
            aria-label="Mobile navigation"
            className="flex border-t px-2 lg:hidden"
          >
            {navigation.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  cn(
                    "flex flex-1 items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold",
                    isActive
                      ? "border-indigo-600 text-indigo-700"
                      : "border-transparent text-slate-500",
                  )
                }
                end={item.end}
                key={item.to}
                to={item.to}
              >
                <item.icon aria-hidden="true" className="size-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
