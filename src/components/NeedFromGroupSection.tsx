'use client'

import { useState } from "react";

export function NeedFromGroupSection({
  inputClassName,
}: {
  inputClassName: string;
}) {
  const [hasNeedFromGroup, setHasNeedFromGroup] = useState<"yes" | "no">(
    "no",
  );

  return (
    <div className="rounded-3xl border border-white/15 bg-white/[0.04] p-5">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">
        Ask the group
      </p>
      <h3 className="mt-2 text-xl font-black">
        Do you need anything from the group today?
      </h3>
      <p className="mt-2 text-sm text-slate-400">
        If not, skip the detail so teammates focus on real asks.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 has-[:checked]:border-cyan-300/70 has-[:checked]:bg-slate-900/70">
          <input
            type="radio"
            name="has_need_from_group"
            value="no"
            checked={hasNeedFromGroup === "no"}
            onChange={() => setHasNeedFromGroup("no")}
            className="h-5 w-5 accent-cyan-300"
          />
          <div>
            <p className="font-bold text-slate-100">No, I&apos;m set</p>
            <p className="text-sm text-slate-500">
              Nothing extra from the group today.
            </p>
          </div>
        </label>

        <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 has-[:checked]:border-cyan-300/70 has-[:checked]:bg-slate-900/70">
          <input
            type="radio"
            name="has_need_from_group"
            value="yes"
            checked={hasNeedFromGroup === "yes"}
            onChange={() => setHasNeedFromGroup("yes")}
            className="h-5 w-5 accent-cyan-300"
          />
          <div>
            <p className="font-bold text-slate-100">Yes, I have an ask</p>
            <p className="text-sm text-slate-500">
              Intro, referrals, tactical help, accountability—whatever fits.
            </p>
          </div>
        </label>
      </div>

      {hasNeedFromGroup === "yes" ? (
        <label className="mt-5 block">
          <span className="text-sm font-bold text-slate-200">
            What do you need from the group? *
          </span>
          <textarea
            name="what_i_need"
            required
            rows={3}
            className={inputClassName}
            placeholder="Example: Intro to someone who sells in this niche, or feedback on LOI wording"
          />
          <span className="mt-2 block text-xs text-slate-500">
            Be specific. Vague asks get vague help.
          </span>
        </label>
      ) : null}
    </div>
  );
}
