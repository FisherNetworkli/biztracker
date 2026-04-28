import type { DealStage, LatestEntry, Urgency } from "@/lib/tracker";

type ChartItem = {
  label: string;
  value: number;
  tone: "cyan" | "emerald" | "amber" | "rose" | "violet";
};

const toneStyles: Record<ChartItem["tone"], string> = {
  cyan: "from-cyan-300 to-blue-400",
  emerald: "from-emerald-300 to-teal-400",
  amber: "from-amber-300 to-orange-400",
  rose: "from-rose-300 to-pink-400",
  violet: "from-violet-300 to-fuchsia-400",
};

const urgencyTone: Record<Urgency, ChartItem["tone"]> = {
  Low: "emerald",
  Medium: "amber",
  High: "rose",
};

function countBy<T extends string>(
  entries: LatestEntry[],
  getKey: (entry: LatestEntry) => T,
) {
  const counts = new Map<T, number>();

  for (const entry of entries) {
    const key = getKey(entry);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
}

function BarList({ items, total }: { items: ChartItem[]; total: number }) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const width = `${Math.max((item.value / maxValue) * 100, 7)}%`;
        const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;

        return (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-slate-200">{item.label}</span>
              <span className="text-slate-400">
                {item.value} · {percent}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-950/70">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${toneStyles[item.tone]}`}
                style={{ width }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RingMetric({
  value,
  label,
  helper,
}: {
  value: number;
  label: string;
  helper: string;
}) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
      <div
        className="mx-auto grid h-28 w-28 place-items-center rounded-full"
        style={{
          background: `conic-gradient(rgb(103 232 249) ${clampedValue}%, rgb(15 23 42) 0)`,
        }}
      >
        <div className="grid h-20 w-20 place-items-center rounded-full bg-slate-950 text-2xl font-black">
          {clampedValue}%
        </div>
      </div>
      <p className="mt-4 text-center font-black">{label}</p>
      <p className="mt-1 text-center text-sm text-slate-400">{helper}</p>
    </div>
  );
}

export function DashboardCharts({
  entries,
  stages,
}: {
  entries: LatestEntry[];
  stages: readonly DealStage[];
}) {
  const total = entries.length;
  const stageCounts = countBy(entries, (entry) => entry.deal_stage);
  const urgencyCounts = countBy(entries, (entry) => entry.urgency);
  const dealFlowCount = entries.filter((entry) =>
    entry.phase.includes("Deal Flow"),
  ).length;
  const closingCount = total - dealFlowCount;
  const averageDay =
    total > 0
      ? Math.round(
          entries.reduce((sum, entry) => sum + entry.day, 0) / total,
        )
      : 0;

  const stageItems = stages
    .map<ChartItem>((stage, index) => ({
      label: stage,
      value: stageCounts.get(stage) ?? 0,
      tone: (["cyan", "emerald", "amber", "violet", "rose"] as const)[
        index % 5
      ],
    }))
    .filter((item) => item.value > 0);

  const urgencyItems = (["High", "Medium", "Low"] as const).map<ChartItem>(
    (urgency) => ({
      label: urgency,
      value: urgencyCounts.get(urgency) ?? 0,
      tone: urgencyTone[urgency],
    }),
  );

  return (
    <section className="mb-8 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-5 shadow-2xl shadow-black/10">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-200">
              Pipeline view
            </p>
            <h3 className="text-2xl font-black">Latest stage distribution</h3>
          </div>
          <p className="text-sm text-slate-400">Based on each person&apos;s newest record</p>
        </div>
        <BarList items={stageItems} total={total} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
        <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-rose-100">
            Urgency mix
          </p>
          <h3 className="mb-5 mt-1 text-2xl font-black">Where attention goes</h3>
          <BarList items={urgencyItems} total={total} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-3">
          <RingMetric
            value={Math.min(averageDay, 100)}
            label={`Avg day ${averageDay}`}
            helper="Average latest log day"
          />
          <RingMetric
            value={Math.round((dealFlowCount / total) * 100)}
            label="Deal flow"
            helper={`${dealFlowCount} buyer${dealFlowCount === 1 ? "" : "s"}`}
          />
          <RingMetric
            value={Math.round((closingCount / total) * 100)}
            label="Closing"
            helper={`${closingCount} buyer${closingCount === 1 ? "" : "s"}`}
          />
        </div>
      </div>
    </section>
  );
}
