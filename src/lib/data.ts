import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase";
import {
  type DailyEntry,
  type EntryInsert,
  type LatestEntry,
  normalizeName,
} from "@/lib/tracker";

export async function createDailyEntry(entry: EntryInsert) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("daily_entries").insert(entry);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getAllEntries(limit = 500) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("daily_entries")
    .select("*")
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getLatestEntries() {
  const entries = await getAllEntries();
  const totals = new Map<string, number>();
  const sameStageCounts = new Map<string, number>();
  const latestByName = new Map<string, DailyEntry>();

  for (const entry of entries) {
    const nameKey = normalizeName(entry.name);
    const stageKey = `${nameKey}:${entry.deal_stage}`;

    totals.set(nameKey, (totals.get(nameKey) ?? 0) + 1);
    sameStageCounts.set(stageKey, (sameStageCounts.get(stageKey) ?? 0) + 1);

    if (!latestByName.has(nameKey)) {
      latestByName.set(nameKey, entry);
    }
  }

  return [...latestByName.values()].map<LatestEntry>((entry) => {
    const nameKey = normalizeName(entry.name);
    const sameStageCount =
      sameStageCounts.get(`${nameKey}:${entry.deal_stage}`) ?? 0;

    return {
      ...entry,
      total_entries: totals.get(nameKey) ?? 0,
      same_stage_count: sameStageCount,
      is_stuck: sameStageCount >= 5,
    };
  });
}

export async function getHighUrgencyEntries() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("daily_entries")
    .select("*")
    .eq("urgency", "High")
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getLeaderboard() {
  const entries = await getAllEntries();
  const leaderboard = new Map<
    string,
    {
      name: string;
      daysLogged: number;
      latestDay: number;
      latestDate: string;
      latestStage: string;
    }
  >();

  for (const entry of entries) {
    const nameKey = normalizeName(entry.name);
    const existing = leaderboard.get(nameKey);

    if (!existing) {
      leaderboard.set(nameKey, {
        name: entry.name,
        daysLogged: 1,
        latestDay: entry.day,
        latestDate: entry.entry_date,
        latestStage: entry.deal_stage,
      });
      continue;
    }

    existing.daysLogged += 1;
  }

  return [...leaderboard.values()].sort((left, right) => {
    if (right.daysLogged !== left.daysLogged) {
      return right.daysLogged - left.daysLogged;
    }

    return right.latestDay - left.latestDay;
  });
}
