"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { AddToHomeScreen } from "@/components/AddToHomeScreen";
import { logoutAction } from "@/app/actions";

const navItems: {
  href: string;
  label: string;
  emphasis?: boolean;
}[] = [
  { href: "/", label: "Dashboard" },
  { href: "/new", label: "Log Today", emphasis: true },
  { href: "/help", label: "Help Feed" },
  { href: "/leaderboard", label: "Leaderboard" },
];

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="size-6"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="size-6"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}

const linkDesk =
  "rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/60 hover:bg-cyan-300/10 hover:text-white";
const linkDeskActive =
  "border-cyan-300/70 bg-cyan-300/15 text-white ring-1 ring-cyan-400/30";

export function AppShellHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelId = useId();

  const mountedOnClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMobileOpen(false);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.removeProperty("overflow");
    };
  }, [mobileOpen]);

  const mobileSheet =
    mobileOpen && mountedOnClient ? (
      <div
        id={panelId}
        className="fixed inset-0 z-[9999] flex max-h-[100dvh] flex-col bg-[#020617] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] pt-[max(0.75rem,env(safe-area-inset-top,0px))] text-white lg:hidden"
        style={{ backgroundColor: "#020617" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="pointer-events-none flex justify-center pt-2">
          <span className="h-1 w-10 rounded-full bg-white/25" aria-hidden />
        </div>

        <div className="flex shrink-0 items-center justify-between border-b border-white/15 pb-4 pt-3">
          <div id="mobile-menu-title">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-200">
              Menu
            </p>
            <p className="mt-1 text-lg font-black text-white">Navigate</p>
          </div>
          <button
            type="button"
            className="rounded-2xl border border-white/20 bg-slate-900 p-3 text-white hover:bg-slate-800"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="mt-5 flex min-h-0 flex-1 flex-col justify-center gap-3 overflow-y-auto overscroll-contain">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
            const base =
              "block rounded-2xl border px-5 py-4 text-center text-base font-bold transition active:scale-[0.99]";
            const inactive = item.emphasis
              ? "border-cyan-400/50 bg-gradient-to-br from-cyan-950 to-slate-900 text-white shadow-md shadow-black/30"
              : "border-white/20 bg-slate-900 text-slate-100";

            const activeCls =
              "border-cyan-400/80 bg-slate-900 text-white shadow-md ring-2 ring-cyan-500/35";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${base} ${active ? activeCls : inactive}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form
          action={logoutAction}
          className="shrink-0 border-t border-white/15 pb-[env(safe-area-inset-bottom,0px)] pt-4"
        >
          <button
            type="submit"
            className="w-full rounded-2xl border border-white/20 bg-slate-900 py-4 text-base font-bold text-slate-100 hover:bg-slate-800"
          >
            Sign out
          </button>
        </form>
      </div>
    ) : null;

  return (
    <header className="mb-6 rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/20 backdrop-blur sm:mb-8 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="min-w-0 space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200 sm:text-sm sm:tracking-[0.28em]">
            Deal Team Dashboard
          </p>
          <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            Business Buying Tracker
          </h1>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <AddToHomeScreen />
          <nav className="hidden flex-wrap justify-end gap-2 lg:flex">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
              const className =
                item.emphasis && !active
                  ? `${linkDesk} border-cyan-400/35 bg-cyan-300/10 text-white`
                  : active
                    ? `${linkDesk} ${linkDeskActive}`
                    : linkDesk;

              return (
                <Link key={item.href} href={item.href} className={className}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <form action={logoutAction} className="hidden lg:block">
            <button
              type="submit"
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Sign out
            </button>
          </form>
          <button
            type="button"
            className="-mr-1 flex shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-3 text-white transition hover:bg-white/15 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls={panelId}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {mountedOnClient && mobileOpen
        ? createPortal(mobileSheet, document.body)
        : null}
    </header>
  );
}
