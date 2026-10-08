import type { ApiSettings } from "@/lib/content";

type Day = ApiSettings["hours"]["days"][number];

/** "08:00" → "8:00 AM" */
export function formatTime(time: string): string {
  const [hours = "0", minutes = "00"] = time.split(":");
  const hour = Number(hours);
  const suffix = hour >= 12 ? "PM" : "AM";

  return `${hour % 12 === 0 ? 12 : hour % 12}:${minutes} ${suffix}`;
}

/**
 * The location card's hours table (Figma 30:342): consecutive days with the
 * same hours become one row — "Monday–Friday · 8:00 AM–5:00 PM",
 * "Saturday–Sunday · Closed".
 */
export function groupHours(days: Day[]): { days: string; hours: string }[] {
  const rows: { from: Day; to: Day; hours: string }[] = [];

  for (const day of [...days].sort((a, b) => a.day - b.day)) {
    const hours = day.is_open && day.opens_at && day.closes_at ? `${formatTime(day.opens_at)}–${formatTime(day.closes_at)}` : "Closed";
    const last = rows.at(-1);

    if (last && last.hours === hours && last.to.day === day.day - 1) {
      last.to = day;
    } else {
      rows.push({ from: day, to: day, hours });
    }
  }

  return rows.map((row) => ({ days: row.from.day === row.to.day ? row.from.name : `${row.from.name}–${row.to.name}`, hours: row.hours }));
}
