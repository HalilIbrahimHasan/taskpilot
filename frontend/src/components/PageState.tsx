import { AlertTriangle, Inbox, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "./ui/Button";

export function LoadingState({ label = "Loading workspace…" }: { label?: string }) {
  return (
    <div className="grid min-h-64 place-items-center" role="status">
      <div className="text-center text-sm font-medium text-slate-500">
        <LoaderCircle aria-hidden="true" className="mx-auto mb-3 size-7 animate-spin text-indigo-600" />
        {label}
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-2xl border border-rose-100 bg-rose-50/50 p-8 text-center">
      <div>
        <AlertTriangle aria-hidden="true" className="mx-auto size-8 text-rose-600" />
        <h2 className="mt-3 font-bold text-slate-950">We couldn’t load this page</h2>
        <p className="mt-1 text-sm text-slate-600">{message}</p>
        <Button className="mt-5" onClick={onRetry} variant="secondary">
          Try again
        </Button>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid min-h-64 place-items-center p-8 text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100">
          <Inbox aria-hidden="true" className="size-6 text-slate-500" />
        </span>
        <h2 className="mt-4 font-bold text-slate-950">{title}</h2>
        <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}
