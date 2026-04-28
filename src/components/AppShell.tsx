import { AppShellHeader } from "@/components/AppShellHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen min-h-[100dvh] w-full max-w-7xl flex-col px-3 py-4 sm:px-6 sm:py-5 lg:px-8">
        <AppShellHeader />

        <main className="flex-1 pb-6">{children}</main>
      </div>
    </div>
  );
}
