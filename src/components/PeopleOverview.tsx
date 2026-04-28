import { StuckPill, UrgencyPill } from "@/components/StatusPill";
import type { LatestEntry } from "@/lib/tracker";

export function PeopleOverview({ entries }: { entries: LatestEntry[] }) {
  return (
    <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.08] p-5 shadow-2xl shadow-black/10">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-200">
            Everyone at a glance
          </p>
          <h3 className="text-2xl font-black">Current status board</h3>
        </div>
        <p className="text-sm text-slate-400">
          One latest record per person, optimized for fast scanning.
        </p>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-white/10 md:block">
        <div className="grid grid-cols-12 gap-3 bg-slate-950/60 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
          <div className="col-span-3">Person</div>
          <div className="col-span-1 text-center">Day</div>
          <div className="col-span-3">Stage</div>
          <div className="col-span-2">Urgency</div>
          <div className="col-span-3">Status</div>
        </div>
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="grid grid-cols-12 items-center gap-3 border-t border-white/5 px-4 py-3"
          >
            <div className="col-span-3">
              <p className="font-black">{entry.name}</p>
              <p className="mt-1 text-xs text-slate-500">{entry.phase}</p>
            </div>
            <div className="col-span-1 text-center text-lg font-black text-cyan-100">
              {entry.day}
            </div>
            <div className="col-span-3 text-sm font-semibold text-slate-200">
              {entry.deal_stage}
            </div>
            <div className="col-span-2">
              <UrgencyPill urgency={entry.urgency} />
            </div>
            <div className="col-span-3 flex flex-wrap gap-2">
              <StuckPill isStuck={entry.is_stuck} count={entry.same_stage_count} />
              {entry.blocker_question ? (
                <span className="rounded-full border border-rose-300/40 bg-rose-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-100">
                  Has blocker
                </span>
              ) : (
                <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-100">
                  Clear
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 md:hidden">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-2xl bg-slate-950/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black">{entry.name}</p>
                <p className="mt-1 text-sm text-slate-400">
                  Day {entry.day} · {entry.deal_stage}
                </p>
              </div>
              <UrgencyPill urgency={entry.urgency} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <StuckPill isStuck={entry.is_stuck} count={entry.same_stage_count} />
              {entry.blocker_question ? (
                <span className="rounded-full border border-rose-300/40 bg-rose-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-100">
                  Has blocker
                </span>
              ) : (
                <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-100">
                  Clear
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
