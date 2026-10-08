import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createCancelToken, verifyCancelToken } from "./cancel-token";
import { buildIcs } from "./ics";
import type { ReserveInput } from "./provider";
import { chooseProvider } from "./providers/index";
import { eventIdForSlot } from "./providers/google";
import { MemoryCalendarProvider, parseDevBusy } from "./providers/memory";

const SECRET = "s".repeat(40);
const START = Date.parse("2026-10-08T09:00:00Z");
const NONCE = "ab".repeat(16);
const slot = { start: START, end: START + 30 * 60_000 };

const reserveInput = (nonce: string, ref: string): ReserveInput => ({
  slot,
  nonce,
  ref,
  name: "Ada",
  email: "ada@example.com",
  intent: "general",
  visitorTimeZone: "Europe/Madrid",
});

describe("cancel token", () => {
  const token = createCancelToken({ start: START, nonce: NONCE, exp: START }, SECRET);

  it("round-trips its claims before expiry", () => {
    assert.deepEqual(verifyCancelToken(token, SECRET, START - 1), {
      start: START,
      nonce: NONCE,
      exp: START,
    });
  });

  it("rejects a tampered payload or signature", () => {
    const [payload, signature] = token.split(".");
    const forged = Buffer.from(`${START + 1800_000}.${NONCE}.${START}`).toString("base64url");
    assert.equal(verifyCancelToken(`${forged}.${signature}`, SECRET, START - 1), null);
    assert.equal(verifyCancelToken(`${payload}.${signature.slice(0, -2)}xx`, SECRET, START - 1), null);
    assert.equal(verifyCancelToken(payload, SECRET, START - 1), null);
    assert.equal(verifyCancelToken("", SECRET, START - 1), null);
  });

  it("rejects another secret", () => {
    assert.equal(verifyCancelToken(token, "x".repeat(40), START - 1), null);
  });

  it("expires at the slot start", () => {
    assert.equal(verifyCancelToken(token, SECRET, START), null);
    assert.equal(verifyCancelToken(token, SECRET, START + 1), null);
  });

  it("binds the nonce: a different booking of the same slot needs a different token", () => {
    const other = createCancelToken({ start: START, nonce: "cd".repeat(16), exp: START }, SECRET);
    assert.notEqual(other, token);
    assert.equal(verifyCancelToken(other, SECRET, START - 1)?.nonce, "cd".repeat(16));
  });
});

describe("memory provider (local dev adapter)", () => {
  it("lets exactly one of two concurrent reserves win", async () => {
    const provider = new MemoryCalendarProvider();
    const results = await Promise.all([
      provider.reserve(reserveInput("11".repeat(16), "A")),
      provider.reserve(reserveInput("22".repeat(16), "B")),
    ]);
    assert.equal(results.filter((result) => result.ok).length, 1);
    assert.equal(results.filter((result) => !result.ok).length, 1);
  });

  it("holds under a larger burst", async () => {
    const provider = new MemoryCalendarProvider();
    const results = await Promise.all(
      Array.from({ length: 25 }, (_, index) =>
        provider.reserve(reserveInput(index.toString(16).padStart(32, "0"), `R${index}`)),
      ),
    );
    assert.equal(results.filter((result) => result.ok).length, 1);
  });

  it("reports a reserved slot as busy and labels its link as fake", async () => {
    const provider = new MemoryCalendarProvider();
    const result = await provider.reserve(reserveInput(NONCE, "REF1"));
    assert.ok(result.ok);
    assert.match(result.meetUrl ?? "", /^https:\/\/meet\.invalid\//);
    assert.equal(provider.mode, "dev-memory");
    assert.deepEqual(await provider.freeBusy({ start: START - 1, end: START + 1 }), [slot]);
  });

  it("cancels only with the matching nonce, idempotently, and frees the slot", async () => {
    const provider = new MemoryCalendarProvider();
    await provider.reserve(reserveInput(NONCE, "REF1"));
    assert.equal(await provider.cancel(START, "ff".repeat(16)), "not_found");
    assert.equal(await provider.cancel(START, NONCE), "cancelled");
    assert.equal(await provider.cancel(START, NONCE), "cancelled");
    const again = await provider.reserve(reserveInput("ee".repeat(16), "REF2"));
    assert.ok(again.ok);
    // The old token's nonce must not cancel the new booking.
    assert.equal(await provider.cancel(START + 1, NONCE), "not_found");
    assert.equal((await provider.freeBusy({ start: START, end: START + 1 })).length, 1);
  });

  it("honours BOOKING_DEV_BUSY instants and whole days", async () => {
    const busy = parseDevBusy("2026-10-08T09:00:00.000Z, 2026-10-09, nonsense", 30, "Europe/Madrid");
    assert.equal(busy.length, 2);
    assert.deepEqual(busy[0], slot);
    assert.ok(busy[1].start <= Date.parse("2026-10-08T22:00:00Z"));
    assert.ok(busy[1].end >= Date.parse("2026-10-09T22:00:00Z"));
    const provider = new MemoryCalendarProvider(busy);
    assert.deepEqual(await provider.reserve(reserveInput(NONCE, "X")), {
      ok: false,
      reason: "conflict",
    });
    assert.deepEqual(parseDevBusy(undefined, 30, "Europe/Madrid"), []);
  });
});

describe("provider selection", () => {
  const google = {
    GOOGLE_OAUTH_CLIENT_ID: "id",
    GOOGLE_OAUTH_CLIENT_SECRET: "secret",
    GOOGLE_OAUTH_REFRESH_TOKEN: "token",
  };

  it("is explicit when nothing is configured", () => {
    assert.deepEqual(chooseProvider({}), { kind: "none", reason: "missing_credentials" });
    assert.deepEqual(chooseProvider({ GOOGLE_OAUTH_CLIENT_ID: "id" }), {
      kind: "none",
      reason: "missing_credentials",
    });
  });

  it("uses google with full credentials", () => {
    assert.deepEqual(chooseProvider({ ...google, NODE_ENV: "production" }), { kind: "google" });
  });

  it("allows the memory adapter only outside production", () => {
    assert.deepEqual(chooseProvider({ CALENDAR_PROVIDER: "memory", NODE_ENV: "development" }), {
      kind: "memory",
    });
    for (const env of [
      { NODE_ENV: "production" },
      { NODE_ENV: "production", VERCEL_ENV: "preview" },
      { NODE_ENV: "development", VERCEL_ENV: "production" },
    ]) {
      assert.deepEqual(chooseProvider({ CALENDAR_PROVIDER: "memory", ...google, ...env }), {
        kind: "none",
        reason: "memory_forbidden_in_production",
      });
    }
  });
});

describe("google event id", () => {
  it("is deterministic per slot and valid base32hex", () => {
    const id = eventIdForSlot("primary", START);
    assert.equal(id, eventIdForSlot("primary", START));
    assert.notEqual(id, eventIdForSlot("primary", START + 1800_000));
    assert.match(id, /^[a-v0-9]{5,1024}$/);
  });
});

describe("ics", () => {
  it("emits UTC times, CRLF lines and escaped text", () => {
    const ics = buildIcs({
      uid: "v-1@site",
      start: START,
      end: slot.end,
      stamp: START - 1000,
      summary: "Videollamada; con, Francisco\nRequena",
      url: "https://meet.invalid/dev-1",
    });
    assert.ok(ics.startsWith("BEGIN:VCALENDAR\r\n"));
    assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
    assert.ok(ics.includes("DTSTART:20261008T090000Z\r\n"));
    assert.ok(ics.includes("DTEND:20261008T093000Z\r\n"));
    assert.ok(ics.includes("SUMMARY:Videollamada\\; con\\, Francisco\\nRequena\r\n"));
    assert.equal(/[^\r]\n/.test(ics), false);
  });

  it("folds long lines to 75 octets", () => {
    const ics = buildIcs({
      uid: "v-2@site",
      start: START,
      end: slot.end,
      stamp: START,
      summary: "ñ".repeat(120),
    });
    for (const line of ics.split("\r\n")) {
      assert.ok(Buffer.byteLength(line, "utf8") <= 75);
    }
  });
});
