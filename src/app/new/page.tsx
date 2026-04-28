import { createEntryAction } from "@/app/actions";
import { BlockerSection } from "@/components/BlockerSection";
import { NeedFromGroupSection } from "@/components/NeedFromGroupSection";
import { AppShell } from "@/components/AppShell";
import { requireTrackerAccess } from "@/lib/auth";
import { dealStages, urgencies } from "@/lib/tracker";

export const dynamic = "force-dynamic";

const today = new Date().toISOString().slice(0, 10);

const inputClass =
  "mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300";

function Field({
  label,
  name,
  required = true,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-200">
        {label}
        {required ? " *" : ""}
      </span>
      {children ?? (
        <input name={name} required={required} className={inputClass} />
      )}
    </label>
  );
}

export default async function NewEntryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireTrackerAccess();
  const { error } = await searchParams;

  return (
    <AppShell>
      <section className="mx-auto max-w-4xl">
        <div className="mb-6 rounded-3xl border border-white/10 bg-white/10 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-200">
            Daily entry
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">
            Log today&apos;s business buying work.
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Keep it specific. The dashboard pulls your latest record so the
            group can see your current progress and what you need.
          </p>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 font-semibold text-rose-100">
            {error}
          </div>
        ) : null}

        <form
          action={createEntryAction}
          className="grid gap-5 rounded-3xl border border-white/10 bg-white/[0.08] p-6 shadow-2xl shadow-black/20"
        >
          <div className="grid gap-5 md:grid-cols-3">
            <Field label="Name" name="name" />
            <Field label="Day" name="day">
              <input
                name="day"
                type="number"
                min="1"
                required
                className={inputClass}
                placeholder="Example: 12"
              />
            </Field>
            <Field label="Date" name="entry_date">
              <input
                name="entry_date"
                type="date"
                required
                defaultValue={today}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Today&apos;s focus" name="todays_focus" />

          <Field label="What I did today" name="what_i_did_today">
            <textarea
              name="what_i_did_today"
              required
              rows={4}
              className={inputClass}
              placeholder="Example: sourced 12 leads, contacted 4 sellers, reviewed one CIM"
            />
          </Field>

          <Field label="Win, in one sentence" name="win" />

          <BlockerSection inputClassName={inputClass} />

          <NeedFromGroupSection inputClassName={inputClass} />

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Deal stage" name="deal_stage">
              <select
                name="deal_stage"
                required
                className={inputClass}
                defaultValue="Lead Sourcing"
              >
                {dealStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Urgency" name="urgency">
              <select
                name="urgency"
                required
                className={inputClass}
                defaultValue="Low"
              >
                {urgencies.map((urgency) => (
                  <option key={urgency} value={urgency}>
                    {urgency}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <button className="rounded-2xl bg-cyan-300 px-5 py-4 font-black text-slate-950 transition hover:bg-cyan-200">
            Save daily entry
          </button>
        </form>
      </section>
    </AppShell>
  );
}
