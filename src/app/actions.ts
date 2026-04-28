"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearTrackerAccessCookie,
  isTrackerPasswordConfigured,
  isValidTrackerPassword,
  requireTrackerAccess,
  setTrackerAccessCookie,
} from "@/lib/auth";
import { createDailyEntry } from "@/lib/data";
import {
  type DailyEntry,
  type EntryInsert,
  isDealStage,
  isUrgency,
} from "@/lib/tracker";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function loginAction(formData: FormData) {
  const password = getString(formData, "password");

  if (!isTrackerPasswordConfigured()) {
    redirectWithError(
      "/login",
      "Sign-in is disabled: add TRACKER_PASSWORD in Vercel (Project → Settings → Environment Variables).",
    );
  }

  if (!password) {
    redirectWithError("/login", "Enter the team password.");
  }

  if (!isValidTrackerPassword(password)) {
    redirect("/login?wrong=1");
  }

  await setTrackerAccessCookie();
  redirect("/");
}

export async function logoutAction() {
  await clearTrackerAccessCookie();
  redirect("/login");
}

export async function createEntryAction(formData: FormData) {
  await requireTrackerAccess();

  const day = Number(getString(formData, "day"));
  const dealStage = getString(formData, "deal_stage");
  const urgency = getString(formData, "urgency");

  if (!Number.isInteger(day) || day < 1) {
    redirectWithError("/new", "Day must be 1 or higher.");
  }

  if (!isDealStage(dealStage)) {
    redirectWithError("/new", "Choose a valid deal stage.");
  }

  if (!isUrgency(urgency)) {
    redirectWithError("/new", "Choose a valid urgency.");
  }

  const hasBlocker = getString(formData, "has_blocker");
  const blockerDetails = getString(formData, "blocker_question");

  if (hasBlocker !== "yes" && hasBlocker !== "no") {
    redirectWithError(
      "/new",
      "Say whether you have a blocker or question to answer.",
    );
  }

  if (hasBlocker === "yes" && !blockerDetails) {
    redirectWithError(
      "/new",
      "Describe your blocker or question, or switch to no if you are clear.",
    );
  }

  const entry: EntryInsert = {
    name: getString(formData, "name"),
    day,
    entry_date: getString(formData, "entry_date"),
    todays_focus: getString(formData, "todays_focus"),
    what_i_did_today: getString(formData, "what_i_did_today"),
    win: getString(formData, "win"),
    blocker_question: hasBlocker === "yes" ? blockerDetails : null,
    what_i_need: getString(formData, "what_i_need"),
    deal_stage: dealStage,
    link_url: null,
    urgency,
  };

  const requiredFields = [
    entry.name,
    entry.entry_date,
    entry.todays_focus,
    entry.what_i_did_today,
    entry.win,
    entry.what_i_need,
  ];

  if (requiredFields.some((field) => !field)) {
    redirectWithError("/new", "Fill out every required field.");
  }

  let newEntry: DailyEntry;

  try {
    newEntry = await createDailyEntry(entry);
  } catch (error) {
    redirectWithError(
      "/new",
      error instanceof Error ? error.message : "Could not save this entry.",
    );
  }

  revalidatePath("/");
  revalidatePath("/help");
  revalidatePath("/leaderboard");
  revalidatePath(`/share/${newEntry.id}`);
  redirect(`/share/${newEntry.id}`);
}
