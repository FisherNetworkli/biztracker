export const dealStages = [
  "No Activity",
  "Lead Sourcing",
  "NDA Signed",
  "Contacted Broker",
  "Contacted Seller",
  "Info Received",
  "In Conversation",
  "Analyzing Financials",
  "Offer Strategy",
  "LOI Submitted",
  "Under LOI",
  "Due Diligence",
  "Financing Secured",
  "Purchase Agreement",
  "Closed",
  "Walked Away",
] as const;

export const urgencies = ["Low", "Medium", "High"] as const;

export type DealStage = (typeof dealStages)[number];
export type Urgency = (typeof urgencies)[number];

export type DailyEntry = {
  id: string;
  name: string;
  day: number;
  entry_date: string;
  phase: string;
  todays_focus: string;
  what_i_did_today: string;
  win: string;
  blocker_question: string | null;
  what_i_need: string;
  deal_stage: DealStage;
  link_url: string | null;
  urgency: Urgency;
  created_at: string;
  updated_at: string;
};

export type EntryInsert = Omit<
  DailyEntry,
  "id" | "phase" | "created_at" | "updated_at"
>;

export type LatestEntry = DailyEntry & {
  total_entries: number;
  same_stage_count: number;
  is_stuck: boolean;
};

export function getPhase(day: number) {
  return day <= 30 ? "Phase 1 - Deal Flow" : "Phase 2 - Closing";
}

export function isDealStage(value: string): value is DealStage {
  return dealStages.includes(value as DealStage);
}

export function isUrgency(value: string): value is Urgency {
  return urgencies.includes(value as Urgency);
}

export function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}
