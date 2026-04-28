import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { UrgencyPill } from "@/components/StatusPill";
import { requireTrackerAccess } from "@/lib/auth";
import { getHighUrgencyEntries } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HelpFeedPage() {
  await requireTrackerAccess();
  const entries = await getHighUrgencyEntries();

  return (
    <AppShell>
      <section className="mb-6 rounded-3xl border border-white/10 bg-white/10 p-6">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-rose-100">
          Help feed
        </p>
        <h2 className="mt-3 text-4xl font-black tracking-tight">
          People who need help now.
        </h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          This feed mirrors the high urgency sheet tab: unblock these people
          first so the group keeps moving.
        </p>
      </section>

      {entries.length === 0 ? (
        <EmptyState
          title="No high urgency asks"
          message="When someone marks an entry as High urgency, it will show up here."
          actionHref="/new"
          actionLabel="Log an entry"
        />
      ) : (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-3xl border border-white/10 bg-white/[0.08] p-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-2xl font-black">{entry.name}</h3>
                  <p className="mt-1 text-sm text-slate-300">
                    Day {entry.day} · {entry.phase} · {entry.deal_stage}
                  </p>
                </div>
                <UrgencyPill urgency={entry.urgency} />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-950/50 p-4">
                  <p className="text-sm font-bold text-slate-200">
                    Blocking issue or question
                  </p>
                  <p className="mt-2 text-slate-300">
                    {entry.blocker_question || "No blocking issue listed."}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-950/50 p-4">
                  <p className="text-sm font-bold text-slate-200">
                    Specific ask
                  </p>
                  <p className="mt-2 text-slate-300">{entry.what_i_need}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
}
