"use client";

import { toBlob } from "html-to-image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

import type { DailyEntry } from "@/lib/tracker";

type Props = {
  entry: DailyEntry;
};

const CARD_WIDTH_PX = 540;

export function ShareTodayPanel({ entry }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string | null>(null);

  const capture = useCallback(async () => {
    const node = cardRef.current;
    if (!node) {
      return null;
    }
    return toBlob(node, {
      width: CARD_WIDTH_PX,
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#020617",
      style: {
        borderRadius: "0",
      },
    });
  }, []);

  const handleDownload = useCallback(async () => {
    setStatus(null);
    try {
      const blob = await capture();
      if (!blob) {
        setStatus("Could not create the image. Try again.");
        return;
      }
      const safeName = entry.name.replace(/\s+/g, "-").slice(0, 40);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `today-${safeName}-day-${entry.day}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus("Download started.");
    } catch {
      setStatus("Could not download. Try another browser or screenshot the card.");
    }
  }, [capture, entry.day, entry.name]);

  const handleCopy = useCallback(async () => {
    setStatus(null);
    try {
      const blob = await capture();
      if (!blob) {
        setStatus("Could not create the image.");
        return;
      }
      if (
        typeof navigator.clipboard === "undefined" ||
        typeof ClipboardItem === "undefined"
      ) {
        setStatus("Copy image is not supported here. Use Download PNG instead.");
        return;
      }
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setStatus("Copied to clipboard. Paste into Facebook.");
    } catch {
      setStatus("Copy failed on this browser. Use Download PNG, then attach in Facebook.");
    }
  }, [capture]);

  const dateLabel = entry.entry_date;

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto pb-2">
        <div ref={cardRef} className="inline-block text-left">
          <div
            style={{ width: CARD_WIDTH_PX }}
            className="overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-8 shadow-2xl"
          >
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
              Business Buying Tracker
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white">
              {entry.name}
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-400">
              Day {entry.day} · {entry.phase}
            </p>
            <p className="mt-1 text-sm text-slate-500">{dateLabel}</p>

            <div className="mt-6 rounded-2xl bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">
                Stage
              </p>
              <p className="mt-1 text-lg font-black text-white">{entry.deal_stage}</p>
              <p className="mt-3 text-xs font-bold uppercase text-slate-500">
                Urgency
              </p>
              <p className="mt-1 text-sm font-bold text-amber-100">{entry.urgency}</p>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="font-bold text-slate-300">Today&apos;s focus</p>
                <p className="mt-1 leading-relaxed text-slate-100">{entry.todays_focus}</p>
              </div>
              <div>
                <p className="font-bold text-slate-300">Win</p>
                <p className="mt-1 leading-relaxed text-slate-100">{entry.win}</p>
              </div>
              <div>
                <p className="font-bold text-slate-300">What I need</p>
                {entry.what_i_need ? (
                  <p className="mt-1 leading-relaxed text-white">
                    {entry.what_i_need}
                  </p>
                ) : (
                  <p className="mt-1 leading-relaxed text-slate-500">
                    Nothing from the group today.
                  </p>
                )}
              </div>
              {entry.blocker_question ? (
                <div className="rounded-2xl border border-rose-400/30 bg-rose-500/15 p-4">
                  <p className="font-bold text-rose-100">Blocker or question</p>
                  <p className="mt-1 leading-relaxed text-rose-50">{entry.blocker_question}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-2xl bg-cyan-300 px-6 py-4 text-center text-sm font-black text-slate-950 transition hover:bg-cyan-200"
        >
          Copy image for Facebook
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/15"
        >
          Download PNG
        </button>
        <Link
          href="/"
          className="rounded-2xl border border-white/10 px-6 py-4 text-center text-sm font-bold text-slate-300 transition hover:bg-white/5"
        >
          Back to dashboard
        </Link>
      </div>
      {status ? <p className="text-sm text-slate-400">{status}</p> : null}
      <p className="text-xs text-slate-500">
        Facebook: on desktop you can paste after copy. On some phones, Download PNG and
        upload from your photos may be easiest.
      </p>
    </div>
  );
}
