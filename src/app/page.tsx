import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DashboardCharts } from "@/components/DashboardCharts";
import { EmptyState } from "@/components/EmptyState";
import { LatestEntryCard } from "@/components/LatestEntryCard";
import { MetricCard } from "@/components/MetricCard";
import { PeopleOverview } from "@/components/PeopleOverview";
import { UrgencyPill } from "@/components/StatusPill";
import { requireTrackerAccess } from "@/lib/auth";
import { getLatestEntries } from "@/lib/data";
import { dealStages } from "@/lib/tracker";

export const dynamic = "force-dynamic";

export default async function Home() {
  await requireTrackerAccess();

  const latestEntries = await getLatestEntries();
  const highUrgencyCount = latestEntries.filter(
    (entry) => entry.urgency === "High",
  ).length;
  const stuckEntries = latestEntries.filter((entry) => entry.is_stuck);
  const blockers = latestEntries.filter((entry) => entry.blocker_question);
  const wins = latestEntries.filter((entry) => entry.win).slice(0, 3);

  return (
    <AppShell>
      <section className="mb-8 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-300/20 via-white/10 to-fuchsia-400/10 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-100">
            Latest records
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            Everyone&apos;s current buying progress in one place.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            Each card pulls the newest record for that person, so the group can
            quickly see who is moving, who needs help, and who is stuck.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/new"
              className="inline-flex items-center justify-center rounded-2xl bg-cyan-300 px-6 py-4 text-base font-black text-slate-950 shadow-xl shadow-cyan-950/20 transition hover:-translate-y-0.5 hover:bg-cyan-200"
            >
              Log Today
            </Link>
            <p className="text-sm font-medium text-slate-300">
              Takes about 60 seconds. Keep the group current.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <MetricCard
            label="Active buyers"
            value={latestEntries.length}
            helper="People with at least one entry"
          />
          <MetricCard
            label="High urgency"
            value={highUrgencyCount}
            helper="Latest records needing attention"
          />
          <MetricCard
            label="Stuck flags"
            value={stuckEntries.length}
            helper="Same stage logged 5+ times"
          />
        </div>
      </section>

      {latestEntries.length === 0 ? (
        <EmptyState
          title="No entries yet"
          message="Once members log their first day, the dashboard will show one latest-record card per person."
          actionHref="/new"
          actionLabel="Log the first entry"
        />
      ) : (
        <>
          <PeopleOverview entries={latestEntries} />

          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <section className="grid gap-5 md:grid-cols-2">
              {latestEntries.map((entry) => (
                <LatestEntryCard key={entry.id} entry={entry} />
              ))}
            </section>

            <aside className="space-y-5">
              <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-5">
                <h3 className="text-xl font-black">Daily callouts</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-rose-100">
                      3 stuck
                    </p>
                    <div className="mt-2 space-y-2">
                      {stuckEntries.slice(0, 3).map((entry) => (
                        <p key={entry.id} className="text-sm text-slate-300">
                          {entry.name}: {entry.deal_stage}
                        </p>
                      ))}
                      {stuckEntries.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          No stuck flags yet.
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-emerald-100">
                      3 wins
                    </p>
                    <div className="mt-2 space-y-2">
                      {wins.map((entry) => (
                        <p key={entry.id} className="text-sm text-slate-300">
                          {entry.name}: {entry.win}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-5">
                <h3 className="text-xl font-black">Needs attention</h3>
                <div className="mt-4 space-y-3">
                  {blockers.slice(0, 5).map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-2xl bg-slate-950/50 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold">{entry.name}</p>
                        <UrgencyPill urgency={entry.urgency} />
                      </div>
                      <p className="mt-2 text-sm text-slate-300">
                        {entry.blocker_question}
                      </p>
                    </div>
                  ))}
                  {blockers.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No blocking issues on latest records.
                    </p>
                  ) : null}
                </div>
              </div>
            </aside>
          </div>

          <details className="group mt-6 rounded-3xl border border-white/10 bg-white/[0.06] p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-2 py-1">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-cyan-200">
                  Analytics
                </p>
                <h3 className="text-xl font-black">View charts and trends</h3>
              </div>
              <span className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 transition group-open:bg-white">
                Open
              </span>
            </summary>
            <div className="pt-5">
              <DashboardCharts entries={latestEntries} stages={dealStages} />
            </div>
          </details>
        </>
      )}
    </AppShell>
  );
}
