import Link from "next/link";
import { StuckPill, UrgencyPill } from "@/components/StatusPill";
import type { LatestEntry } from "@/lib/tracker";

export function LatestEntryCard({ entry }: { entry: LatestEntry }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.08] p-5 shadow-2xl shadow-black/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black tracking-tight">{entry.name}</h3>
          <p className="mt-1 text-sm text-slate-300">
            Day {entry.day} · {entry.phase}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <UrgencyPill urgency={entry.urgency} />
          <StuckPill isStuck={entry.is_stuck} count={entry.same_stage_count} />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
      <div className="mt-5 rounded-2xl bg-slate-950/50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">
          Current Stage
        </p>
        <p className="mt-1 text-lg font-bold">{entry.deal_stage}</p>
        <p className="mt-2 text-sm text-slate-300">
          Logged {entry.total_entries} day{entry.total_entries === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-5 grid gap-4 text-sm">
        <div>
          <p className="font-bold text-slate-200">Latest win</p>
          <p className="mt-1 text-slate-300">{entry.win}</p>
        </div>
        <div>
          <p className="font-bold text-slate-200">What they need</p>
          <p className="mt-1 text-slate-300">{entry.what_i_need}</p>
        </div>
        {entry.blocker_question ? (
          <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-3">
            <p className="font-bold text-rose-100">
              Blocking issue or question
            </p>
            <p className="mt-1 text-rose-50">{entry.blocker_question}</p>
          </div>
        ) : null}
      </div>
      </div>

      <div className="mt-auto border-t border-white/10 pt-4">
        <Link
          href={`/share/${entry.id}`}
          className="text-sm font-bold text-cyan-200 hover:text-cyan-100"
        >
          Share today card (image)
        </Link>
      </div>
    </article>
  );
}
