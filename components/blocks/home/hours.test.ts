import { describe, expect, it } from "vitest";
import { formatTime, groupHours } from "./hours";

const day = (n: number, name: string, open: boolean, opens: string | null = "08:00", closes: string | null = "17:00") => ({
  day: n,
  name,
  is_open: open,
  opens_at: open ? opens : null,
  closes_at: open ? closes : null,
  display: "",
});

const week = [
  day(1, "Monday", true),
  day(2, "Tuesday", true),
  day(3, "Wednesday", true),
  day(4, "Thursday", true),
  day(5, "Friday", true),
  day(6, "Saturday", false),
  day(7, "Sunday", false),
];

describe("location hours", () => {
  it("groups consecutive days with the same hours, as the Figma card prints them", () => {
    expect(groupHours(week)).toEqual([
      { days: "Monday–Friday", hours: "8:00 AM–5:00 PM" },
      { days: "Saturday–Sunday", hours: "Closed" },
    ]);
  });

  it("keeps a single day on its own and splits non-consecutive matches", () => {
    const custom = [...week];
    custom[2] = day(3, "Wednesday", true, "09:30", "12:00");

    expect(groupHours(custom).map((row) => row.days)).toEqual(["Monday–Tuesday", "Wednesday", "Thursday–Friday", "Saturday–Sunday"]);
  });

  it("formats 24-hour times as 12-hour clock", () => {
    expect([formatTime("00:15"), formatTime("12:00"), formatTime("17:30")]).toEqual(["12:15 AM", "12:00 PM", "5:30 PM"]);
  });
});
