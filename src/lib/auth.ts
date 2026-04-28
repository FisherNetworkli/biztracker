import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const accessCookieName = "business_tracker_access";

function getConfiguredPassword(): string | null {
  const password = process.env.TRACKER_PASSWORD;
  return password && password.trim().length > 0 ? password.trim() : null;
}

/** True when TRACKER_PASSWORD is set (used by login UI and guards). */
export function isTrackerPasswordConfigured(): boolean {
  return Boolean(getConfiguredPassword());
}

function getPasswordOrThrow(): string {
  const password = getConfiguredPassword();
  if (!password) {
    throw new Error("TRACKER_PASSWORD is not configured.");
  }

  return password;
}

function hashSecret(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

function safeEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export async function hasTrackerAccess() {
  const configured = getConfiguredPassword();

  /* No password on the server invalidates cookie auth without throwing — avoids 500s in production. */
  if (!configured) {
    return false;
  }

  const cookieStore = await cookies();
  const accessCookie = cookieStore.get(accessCookieName)?.value;

  if (!accessCookie) {
    return false;
  }

  return safeEquals(accessCookie, hashSecret(configured));
}

export async function requireTrackerAccess() {
  if (!(await hasTrackerAccess())) {
    redirect("/login");
  }
}

export async function setTrackerAccessCookie() {
  const cookieStore = await cookies();

  cookieStore.set(accessCookieName, hashSecret(getPasswordOrThrow()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearTrackerAccessCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(accessCookieName);
}

export function isValidTrackerPassword(password: string) {
  const configured = getConfiguredPassword();
  if (!configured) {
    return false;
  }

  return safeEquals(hashSecret(password), hashSecret(configured));
}
