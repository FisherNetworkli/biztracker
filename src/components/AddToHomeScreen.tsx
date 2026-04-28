"use client";

import { createPortal } from "react-dom";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

type BeforeInstallPrompt = Event & {
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

export function AddToHomeScreen() {
  const standalone = useSyncExternalStore(
    subscribeStandalone,
    getStandaloneSnapshot,
    () => false,
  );
  const [deferredInstall, setDeferredInstall] =
    useState<BeforeInstallPrompt | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    function onBeforeInstall(event: Event) {
      event.preventDefault();
      setDeferredInstall(event as BeforeInstallPrompt);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

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
      setDeferredInstall(null);
    }
  }, [deferredInstall]);

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
      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
        App mode
      </p>
    );
  }

  if (deferredInstall) {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={handleInstall}
        className="rounded-full border border-cyan-400/40 bg-cyan-300/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-cyan-100 hover:bg-cyan-300/25 disabled:opacity-60 sm:text-xs"
      >
        {busy ? "Installing…" : "Install"}
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setHelpOpen(true)}
        className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-200 hover:bg-white/15 sm:px-3 sm:text-xs"
      >
        Add to Home Screen
      </button>
      {helpSheet ? createPortal(helpSheet, document.body) : null}
    </>
  );
}
