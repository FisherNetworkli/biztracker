"use client";

import { createPortal } from "react-dom";
import { useCallback, useState, useSyncExternalStore } from "react";

export type BeforeInstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIosDevice() {
  if (typeof navigator === "undefined") {
    return false;
  }
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function getStandaloneSnapshot(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean(nav.standalone)
  );
}

function subscribeStandalone(onChange: () => void) {
  const mq = window.matchMedia("(display-mode: standalone)");
  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }
  mq.addListener(onChange);
  return () => mq.removeListener(onChange);
}

const menuBtn =
  "w-full rounded-2xl border px-5 py-4 text-center text-base font-bold transition active:scale-[0.99]";

type Props = {
  deferredInstall: BeforeInstallPrompt | null;
  onDeferredConsumed: () => void;
};

export function AddToHomeScreen({ deferredInstall, onDeferredConsumed }: Props) {
  const standalone = useSyncExternalStore(
    subscribeStandalone,
    getStandaloneSnapshot,
    () => false,
  );
  const [helpOpen, setHelpOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleInstall = useCallback(async () => {
    if (!deferredInstall) {
      return;
    }
    setBusy(true);
    try {
      await deferredInstall.prompt();
      await deferredInstall.userChoice;
    } finally {
      setBusy(false);
      onDeferredConsumed();
    }
  }, [deferredInstall, onDeferredConsumed]);

  const helpTitle = isIosDevice()
    ? "Add Biz Tracker on iPhone or iPad"
    : "Add Biz Tracker to your device";

  const helpBody = isIosDevice() ? (
    <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-slate-300">
      <li>
        Tap the{" "}
        <span className="font-semibold text-white">Share</span> button (square
        with an arrow) — at the bottom on iPhone Safari, or top on iPad.
      </li>
      <li>
        Choose{" "}
        <span className="font-semibold text-white">Add to Home Screen</span>,
        then <span className="font-semibold text-white">Add</span>.
      </li>
      <li>Open Biz Tracker from your home screen like any other app.</li>
    </ol>
  ) : (
    <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-slate-300">
      <li>
        Look for <span className="font-semibold text-white">Install app</span>{" "}
        in your browser (often in the ⋮ menu on Chrome).
      </li>
      <li>
        Or use your browser&apos;s{" "}
        <span className="font-semibold text-white">Add to Home screen</span> /
        <span className="font-semibold text-white"> Install</span> option.
      </li>
      <li>You’ll get the Biz Tracker icon on your home screen.</li>
    </ol>
  );

  const helpSheet =
    helpOpen && typeof document !== "undefined" ? (
      <div
        className="fixed inset-0 z-[10050] flex items-end justify-center bg-black/70 p-4 sm:items-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-home-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setHelpOpen(false);
          }
        }}
      >
        <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#020617] p-6 shadow-2xl">
          <h2 id="add-home-title" className="text-lg font-black text-white">
            {helpTitle}
          </h2>
          {helpBody}
          <button
            type="button"
            className="mt-6 w-full rounded-2xl bg-cyan-300 py-3 text-sm font-black text-slate-950"
            onClick={() => setHelpOpen(false)}
          >
            Got it
          </button>
        </div>
      </div>
    ) : null;

  if (standalone) {
    return (
      <p
        className={`${menuBtn} border-white/10 bg-slate-900/50 text-sm font-semibold text-slate-500`}
        role="status"
      >
        Running as installed app
      </p>
    );
  }

  if (deferredInstall) {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={handleInstall}
        className={`${menuBtn} border-cyan-400/50 bg-cyan-300/15 text-cyan-50 hover:bg-cyan-300/25 disabled:opacity-60`}
      >
        {busy ? "Installing…" : "Install app"}
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setHelpOpen(true)}
        className={`${menuBtn} border-white/20 bg-slate-900 text-slate-100 hover:bg-slate-800`}
      >
        Add to Home Screen
      </button>
      {helpSheet ? createPortal(helpSheet, document.body) : null}
    </>
  );
}
