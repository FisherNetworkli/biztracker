import type { Urgency } from "@/lib/tracker";

const urgencyStyles: Record<Urgency, string> = {
  Low: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  Medium: "border-amber-300/40 bg-amber-300/15 text-amber-100",
  High: "border-rose-300/50 bg-rose-400/20 text-rose-100",
};

export function UrgencyPill({ urgency }: { urgency: Urgency }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${urgencyStyles[urgency]}`}
    >
      {urgency}
    </span>
  );
}

export function StuckPill({
  isStuck,
  count,
}: {
  isStuck: boolean;
  count: number;
}) {
  if (!isStuck) {
    return null;
  }

  return (
    <span className="inline-flex rounded-full border border-red-300/50 bg-red-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-100">
      Stuck {count}x
    </span>
  );
}
