import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { requireTrackerAccess } from "@/lib/auth";
import { getLeaderboard } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  await requireTrackerAccess();
  const leaderboard = await getLeaderboard();
  const maxDaysLogged = Math.max(
    ...leaderboard.map((member) => member.daysLogged),
    1,
  );

  return (
    <AppShell>
      <section className="mb-6 rounded-3xl border border-white/10 bg-white/10 p-6">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-200">
          Accountability
        </p>
        <h2 className="mt-3 text-4xl font-black tracking-tight">
          Consistency leaderboard.
        </h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Days logged tells you who is showing up daily versus who is drifting.
        </p>
      </section>

      {leaderboard.length === 0 ? (
        <EmptyState
          title="No one on the board yet"
          message="The leaderboard fills in as members submit daily entries."
          actionHref="/new"
          actionLabel="Log an entry"
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.08]">
          <div className="grid grid-cols-12 gap-3 border-b border-white/10 px-5 py-4 text-sm font-bold uppercase tracking-wide text-slate-400">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Name</div>
            <div className="col-span-2 text-right">Days</div>
            <div className="col-span-2 text-right">Latest day</div>
            <div className="col-span-2 text-right">Stage</div>
          </div>
          {leaderboard.map((member, index) => (
            <div
              key={member.name}
              className="grid grid-cols-12 gap-3 border-b border-white/5 px-5 py-4 last:border-0"
            >
              <div className="col-span-1 font-black text-cyan-200">
                {index + 1}
              </div>
              <div className="col-span-5">
                <p className="font-black">{member.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Latest: {member.latestDate}
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300"
                    style={{
                      width: `${Math.max(
                        (member.daysLogged / maxDaysLogged) * 100,
                        8,
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <div className="col-span-2 text-right text-2xl font-black">
                {member.daysLogged}
              </div>
              <div className="col-span-2 text-right">Day {member.latestDay}</div>
              <div className="col-span-2 text-right text-sm text-slate-300">
                {member.latestStage}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
