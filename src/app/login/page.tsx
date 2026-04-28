import { redirect } from "next/navigation";
import { loginAction } from "@/app/actions";
import { hasTrackerAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; wrong?: string }>;
}) {
  if (await hasTrackerAccess()) {
    redirect("/");
  }

  const { error, wrong } = await searchParams;
  const showWrongPassword = wrong === "1" || wrong === "true";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl shadow-black/30">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-200">
          Private tracker
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">
          Enter the team password
        </h1>
        <p className="mt-3 text-slate-300">
          This keeps the dashboard simple while avoiding a fully public tracker.
        </p>

        {showWrongPassword ? (
          <div
            role="alert"
            aria-live="assertive"
            className="mt-6 rounded-2xl border border-rose-400/50 bg-rose-500/15 p-4 shadow-lg shadow-rose-950/20"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-rose-300">
              Access denied
            </p>
            <p className="mt-2 text-lg font-black text-white">Wrong password</p>
            <p className="mt-2 text-sm leading-relaxed text-rose-100/95">
              That does not match the current team password. Try again carefully,
              copy-pasting if needed, or ask whoever runs the tracker for this
              month&apos;s password.
            </p>
          </div>
        ) : null}

        {error && !showWrongPassword ? (
          <div
            role="alert"
            aria-live="polite"
            className="mt-6 rounded-2xl border border-rose-400/40 bg-rose-500/12 p-4 text-sm font-semibold text-rose-100"
          >
            {error}
          </div>
        ) : null}

        <form action={loginAction} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-slate-200">Password</span>
            <input
              name="password"
              type="password"
              required
              autoFocus
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
              placeholder="Shared team password"
            />
          </label>
          <button className="w-full rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-200">
            Open dashboard
          </button>
        </form>
      </section>
    </main>
  );
}
