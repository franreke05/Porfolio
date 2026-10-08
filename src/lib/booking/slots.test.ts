import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { bookingConfig } from "./config";
import type { BookingConfig } from "./config";
import { candidateSlotsForDate, findSlot, generateAvailability, queryWindow } from "./slots";
import { addDays, civilDateIn, parseCivilDate, wallToUtc, weekdayOf, zonedParts } from "./time";

const TZ = "Europe/Madrid";
const iso = (ts: number) => new Date(ts).toISOString();
const at = (value: string) => Date.parse(value);
const starts = (config: BookingConfig, date: string) =>
  candidateSlotsForDate(config, date).map((slot) => iso(slot.start));

describe("wallToUtc", () => {
  it("converts winter and summer wall time", () => {
    assert.equal(iso(wallToUtc(TZ, 2026, 1, 15, 11, 0)!), "2026-01-15T10:00:00.000Z");
    assert.equal(iso(wallToUtc(TZ, 2026, 7, 15, 11, 0)!), "2026-07-15T09:00:00.000Z");
  });

  it("round-trips every bookable wall time across two years", () => {
    for (let day = 0; day < 730; day += 1) {
      const date = parseCivilDate(addDays("2026-01-01", day))!;
      for (const [hour, minute] of [[11, 0], [11, 30], [12, 0], [12, 30]]) {
        const utc = wallToUtc(TZ, date.year, date.month, date.day, hour, minute);
        assert.notEqual(utc, null);
        const parts = zonedParts(utc!, TZ);
        assert.deepEqual(
          [parts.year, parts.month, parts.day, parts.hour, parts.minute],
          [date.year, date.month, date.day, hour, minute],
        );
      }
    }
  });

  it("returns null for a wall time skipped by spring-forward", () => {
    assert.equal(wallToUtc(TZ, 2026, 3, 29, 2, 30), null);
    assert.equal(wallToUtc(TZ, 2027, 3, 28, 2, 30), null);
  });

  it("resolves the repeated autumn hour to a real instant", () => {
    const utc = wallToUtc(TZ, 2026, 10, 25, 2, 30);
    assert.notEqual(utc, null);
    assert.equal(zonedParts(utc!, TZ).hour, 2);
  });
});

describe("civil dates", () => {
  it("validates, adds days and finds weekdays", () => {
    assert.equal(parseCivilDate("2026-02-30"), null);
    assert.equal(parseCivilDate("26-2-3"), null);
    assert.equal(addDays("2026-12-31", 1), "2027-01-01");
    assert.equal(addDays("2028-02-28", 1), "2028-02-29");
    assert.equal(weekdayOf("2026-10-07"), 3);
  });

  it("uses the Madrid date, not the UTC date", () => {
    assert.equal(civilDateIn(at("2026-10-07T22:30:00Z"), TZ), "2026-10-08");
  });
});

describe("slot generation", () => {
  it("emits four 30-minute slots 11:00-13:00 Madrid", () => {
    assert.deepEqual(starts(bookingConfig, "2026-10-08"), [
      "2026-10-08T09:00:00.000Z",
      "2026-10-08T09:30:00.000Z",
      "2026-10-08T10:00:00.000Z",
      "2026-10-08T10:30:00.000Z",
    ]);
    const last = candidateSlotsForDate(bookingConfig, "2026-10-08").at(-1)!;
    assert.equal(iso(last.end), "2026-10-08T11:00:00.000Z");
  });

  it("shifts the UTC instant across both 2026 DST transitions", () => {
    assert.equal(starts(bookingConfig, "2026-03-27")[0], "2026-03-27T10:00:00.000Z");
    assert.equal(starts(bookingConfig, "2026-03-30")[0], "2026-03-30T09:00:00.000Z");
    assert.equal(starts(bookingConfig, "2026-10-23")[0], "2026-10-23T09:00:00.000Z");
    assert.equal(starts(bookingConfig, "2026-10-26")[0], "2026-10-26T10:00:00.000Z");
  });

  it("shifts the UTC instant across both 2027 DST transitions", () => {
    assert.equal(starts(bookingConfig, "2027-03-26")[0], "2027-03-26T10:00:00.000Z");
    assert.equal(starts(bookingConfig, "2027-03-29")[0], "2027-03-29T09:00:00.000Z");
    assert.equal(starts(bookingConfig, "2027-10-29")[0], "2027-10-29T09:00:00.000Z");
    assert.equal(starts(bookingConfig, "2027-11-01")[0], "2027-11-01T10:00:00.000Z");
  });

  it("excludes weekends, including the DST Sundays", () => {
    for (const date of ["2026-10-10", "2026-10-11", "2026-03-29", "2026-10-25"]) {
      assert.deepEqual(candidateSlotsForDate(bookingConfig, date), []);
    }
  });

  it("spaces slots by the buffer", () => {
    const buffered = { ...bookingConfig, bufferMinutes: 15 };
    assert.deepEqual(starts(buffered, "2026-10-08"), [
      "2026-10-08T09:00:00.000Z",
      "2026-10-08T09:45:00.000Z",
      "2026-10-08T10:30:00.000Z",
    ]);
  });
});

describe("generateAvailability", () => {
  const now = at("2026-10-07T08:00:00Z"); // Wed 10:00 Madrid

  it("lists business days only and applies the minimum notice", () => {
    const days = generateAvailability(bookingConfig, { from: "2026-10-07", days: 6 }, [], now);
    assert.deepEqual(
      days.map((day) => day.date),
      ["2026-10-07", "2026-10-08", "2026-10-09", "2026-10-12"],
    );
    // 12 h notice from 08:00Z => nothing today, everything tomorrow.
    assert.equal(days[0].slots.length, 0);
    assert.equal(days[1].slots.length, 4);
  });

  it("cuts slots that start inside the notice window", () => {
    const late = at("2026-10-07T21:45:00Z"); // + 12 h = 09:45Z next day
    const days = generateAvailability(bookingConfig, { from: "2026-10-08", days: 1 }, [], late);
    assert.deepEqual(
      days[0].slots.map((slot) => iso(slot.start)),
      ["2026-10-08T10:00:00.000Z", "2026-10-08T10:30:00.000Z"],
    );
  });

  it("removes slots overlapping busy time and keeps touching ones", () => {
    const busy = [{ start: at("2026-10-08T09:15:00Z"), end: at("2026-10-08T10:00:00Z") }];
    const days = generateAvailability(bookingConfig, { from: "2026-10-08", days: 1 }, busy, now);
    assert.deepEqual(
      days[0].slots.map((slot) => iso(slot.start)),
      ["2026-10-08T10:00:00.000Z", "2026-10-08T10:30:00.000Z"],
    );
  });

  it("widens busy time by the buffer", () => {
    const buffered = { ...bookingConfig, bufferMinutes: 15 };
    const busy = [{ start: at("2026-10-08T08:00:00Z"), end: at("2026-10-08T09:00:00Z") }];
    const days = generateAvailability(buffered, { from: "2026-10-08", days: 1 }, busy, now);
    assert.deepEqual(
      days[0].slots.map((slot) => iso(slot.start)),
      ["2026-10-08T09:45:00.000Z", "2026-10-08T10:30:00.000Z"],
    );
  });

  it("reports a fully booked day as an empty list, not a missing day", () => {
    const busy = [{ start: at("2026-10-08T00:00:00Z"), end: at("2026-10-09T00:00:00Z") }];
    const days = generateAvailability(bookingConfig, { from: "2026-10-08", days: 2 }, busy, now);
    assert.deepEqual(days.map((day) => [day.date, day.slots.length]), [
      ["2026-10-08", 0],
      ["2026-10-09", 4],
    ]);
  });

  it("ignores past days and days beyond the horizon", () => {
    const past = generateAvailability(bookingConfig, { from: "2026-10-01", days: 3 }, [], now);
    assert.deepEqual(past, []);
    const far = generateAvailability(bookingConfig, { from: "2026-10-27", days: 5 }, [], now);
    assert.deepEqual(far.map((day) => day.date), ["2026-10-27", "2026-10-28"]);
  });

  it("covers the whole range with the provider query window", () => {
    const window = queryWindow({ from: "2026-10-08", days: 2 });
    assert.ok(window.start <= at("2026-10-07T22:00:00Z"));
    assert.ok(window.end >= at("2026-10-09T22:00:00Z"));
  });
});

describe("findSlot", () => {
  const now = at("2026-10-07T08:00:00Z");

  it("accepts only instants on the configured grid", () => {
    assert.notEqual(findSlot(bookingConfig, at("2026-10-08T09:30:00Z"), now), null);
    assert.equal(findSlot(bookingConfig, at("2026-10-08T09:15:00Z"), now), null);
    assert.equal(findSlot(bookingConfig, at("2026-10-08T11:00:00Z"), now), null);
    assert.equal(findSlot(bookingConfig, at("2026-10-10T09:00:00Z"), now), null);
    assert.equal(findSlot(bookingConfig, Number.NaN, now), null);
  });

  it("rejects slots inside the notice window, in the past or past the horizon", () => {
    assert.equal(findSlot(bookingConfig, at("2026-10-07T10:30:00Z"), now), null);
    assert.equal(findSlot(bookingConfig, at("2026-10-06T09:00:00Z"), now), null);
    assert.equal(findSlot(bookingConfig, at("2026-12-01T10:00:00Z"), now), null);
  });
});
