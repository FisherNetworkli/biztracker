import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { DailyEntry, DealStage, Urgency } from "@/lib/tracker";

type DailyEntryInsert = {
  name: string;
  day: number;
  entry_date: string;
  todays_focus: string;
  what_i_did_today: string;
  win: string;
  blocker_question?: string | null;
  what_i_need: string | null;
  deal_stage: DealStage;
  link_url?: string | null;
  urgency: Urgency;
};

type Database = {
  public: {
    Tables: {
      daily_entries: {
        Row: DailyEntry;
        Insert: DailyEntryInsert;
        Update: Partial<DailyEntryInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
