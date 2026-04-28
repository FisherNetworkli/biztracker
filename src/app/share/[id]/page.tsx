import { notFound } from "next/navigation";

import { AppShell } from "@/components/AppShell";
import { ShareTodayPanel } from "@/components/ShareTodayPanel";
import { requireTrackerAccess } from "@/lib/auth";
import { getEntryById } from "@/lib/data";

export const dynamic = "force-dynamic";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ShareTodayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireTrackerAccess();
  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    notFound();
  }

  const entry = await getEntryById(id);

  if (!entry) {
    notFound();
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-2xl">
        <div className="mb-6 rounded-3xl border border-white/10 bg-white/10 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-200">
            Share
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">
            Share your today card
          </h1>
          <p className="mt-3 max-w-xl text-slate-300">
            Copy or download this image for your Facebook group post.
          </p>
        </div>
        <ShareTodayPanel entry={entry} />
      </section>
    </AppShell>
  );
}
