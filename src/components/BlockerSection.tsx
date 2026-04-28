'use client'

import { useState } from "react";

export function BlockerSection({ inputClassName }: { inputClassName: string }) {
  const [hasBlocker, setHasBlocker] = useState<"yes" | "no">("no");

  return (
    <div className="rounded-3xl border border-white/15 bg-white/[0.04] p-5">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">
        Blocking or unclear
      </p>
      <h3 className="mt-2 text-xl font-black">
        Do you have a question or something blocking you?
      </h3>
      <p className="mt-2 text-sm text-slate-400">
        If not, skip the details below so the group spends time on real blockers.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 has-[:checked]:border-cyan-300/70 has-[:checked]:bg-slate-900/70">
          <input
            type="radio"
            name="has_blocker"
            value="no"
            checked={hasBlocker === "no"}
            onChange={() => setHasBlocker("no")}
            className="h-5 w-5 accent-cyan-300"
          />
          <div>
            <p className="font-bold text-slate-100">No, I&apos;m clear</p>
            <p className="text-sm text-slate-500">
              Nothing is blocking momentum right now.
            </p>
          </div>
        </label>

        <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 has-[:checked]:border-cyan-300/70 has-[:checked]:bg-slate-900/70">
          <input
            type="radio"
            name="has_blocker"
            value="yes"
            checked={hasBlocker === "yes"}
            onChange={() => setHasBlocker("yes")}
            className="h-5 w-5 accent-cyan-300"
          />
          <div>
            <p className="font-bold text-slate-100">
              Yes, I have an issue or question
            </p>
            <p className="text-sm text-slate-500">
              Share what&apos;s slowing you down or what you&apos;re unsure about.
            </p>
          </div>
        </label>
      </div>

      {hasBlocker === "yes" ? (
        <label className="mt-5 block">
          <span className="text-sm font-bold text-slate-200">
            Describe what is blocking you or what you need clarified *
          </span>
          <textarea
            name="blocker_question"
            required
            rows={4}
            className={inputClassName}
            placeholder="Example: I need help structuring seller financing on a $1.2M ask with weak books"
          />
          <span className="mt-2 block text-xs text-slate-500">
            Be concrete. Vague asks get vague help.
          </span>
        </label>
      ) : null}
    </div>
  );
}
