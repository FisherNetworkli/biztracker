import Link from "next/link";
import { logoutAction } from "@/app/actions";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/new", label: "Log Today" },
  { href: "/help", label: "Help Feed" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">
                Deal Team Dashboard
              </p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Business Buying Tracker
              </h1>
            </Link>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <nav className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/60 hover:bg-cyan-300/10 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <form action={logoutAction}>
                <button className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
