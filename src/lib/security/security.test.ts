import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FORM_TOKEN_MAX_AGE_MS,
  FORM_TOKEN_MIN_AGE_MS,
  issueFormToken,
  verifyFormToken,
} from "./form-token";
import { configuredOrigins, isAllowedOrigin } from "./origin";
import { MemoryRateLimiter, hashClientKey } from "./rate-limit";
import { escapeHtml, escapeIcsText, sanitizeLine, sanitizeText } from "./sanitize";

describe("sanitisation", () => {
  it("makes single-line values header-safe", () => {
    assert.equal(sanitizeLine("  Ada\r\nBcc: evil@x.com\t "), "Ada Bcc: evil@x.com");
    assert.equal(sanitizeLine("a\u0000b\u200Bc\u202Ed"), "abcd");
    assert.equal(sanitizeLine("a    b"), "a b");
  });

  it("keeps line breaks in multi-line text but drops control chars", () => {
    assert.equal(sanitizeText("uno\r\ndos\rtres\u0007\n\n\n\ncuatro  "), "uno\ndos\ntres\n\ncuatro");
  });

  it("escapes HTML and iCalendar text", () => {
    assert.equal(
      escapeHtml(`<img src=x onerror="a('b')">&`),
      "&lt;img src=x onerror=&quot;a(&#039;b&#039;)&quot;&gt;&amp;",
    );
    assert.equal(escapeIcsText("a\\b;c,d\r\ne"), "a\\\\b\\;c\\,d\\ne");
  });
});

describe("memory rate limiter", () => {
  it("allows up to the limit, then blocks with a retry hint", () => {
    const limiter = new MemoryRateLimiter();
    assert.equal(limiter.hit("k", 2, 1000, 0).allowed, true);
    assert.equal(limiter.hit("k", 2, 1000, 100).allowed, true);
    assert.deepEqual(limiter.hit("k", 2, 1000, 200), { allowed: false, retryAfterSeconds: 1 });
  });

  it("slides: old hits stop counting and blocked hits are not recorded", () => {
    const limiter = new MemoryRateLimiter();
    limiter.hit("k", 2, 1000, 0);
    limiter.hit("k", 2, 1000, 600);
    assert.equal(limiter.hit("k", 2, 1000, 900).allowed, false);
    assert.equal(limiter.hit("k", 2, 1000, 1001).allowed, true);
    assert.equal(limiter.hit("k", 2, 1000, 1500).allowed, false);
    assert.equal(limiter.hit("k", 2, 1000, 1601).allowed, true);
  });

  it("keeps keys independent and bounds memory", () => {
    const limiter = new MemoryRateLimiter(2);
    assert.equal(limiter.hit("a", 1, 1000, 0).allowed, true);
    assert.equal(limiter.hit("b", 1, 1000, 0).allowed, true);
    assert.equal(limiter.hit("a", 1, 1000, 1).allowed, false);
    limiter.hit("c", 1, 1000, 2); // evicts the least recently used key
    assert.equal(limiter.hit("a", 1, 1000, 3).allowed, true);
  });

  it("hashes the client key without exposing the address", () => {
    const key = hashClientKey("203.0.113.9", "salt");
    assert.equal(key, hashClientKey("203.0.113.9", "salt"));
    assert.notEqual(key, hashClientKey("203.0.113.9", "other"));
    assert.equal(key.includes("203"), false);
    assert.match(key, /^[a-f0-9]{32}$/);
  });
});

describe("form token", () => {
  const secret = "k".repeat(40);
  const issuedAt = 1_800_000_000_000;
  const token = issueFormToken(secret, issuedAt);

  it("accepts a human-paced submission", () => {
    assert.equal(verifyFormToken(token, secret, issuedAt + FORM_TOKEN_MIN_AGE_MS), "ok");
  });

  it("flags instant submissions and stale tokens", () => {
    assert.equal(verifyFormToken(token, secret, issuedAt + 500), "too_fast");
    assert.equal(verifyFormToken(token, secret, issuedAt + FORM_TOKEN_MAX_AGE_MS + 1), "expired");
  });

  it("rejects forged timestamps, other secrets and garbage", () => {
    const signature = token.split(".")[1];
    assert.equal(verifyFormToken(`${issuedAt - 60_000}.${signature}`, secret, issuedAt), "invalid");
    assert.equal(verifyFormToken(token, "z".repeat(40), issuedAt + 5000), "invalid");
    assert.equal(verifyFormToken("nope", secret, issuedAt), "invalid");
    assert.equal(verifyFormToken("", secret, issuedAt), "invalid");
  });
});

describe("origin check", () => {
  const allowed = configuredOrigins({
    SITE_ORIGIN: "https://example.com/",
    VERCEL_URL: "preview-abc.vercel.app",
  });

  it("builds the allowlist from configuration", () => {
    assert.deepEqual(allowed, ["https://example.com", "https://preview-abc.vercel.app"]);
    assert.deepEqual(configuredOrigins({ SITE_ORIGIN: "javascript:alert(1)" }), []);
  });

  it("accepts allowlisted and same-host origins", () => {
    assert.equal(isAllowedOrigin("https://example.com", "other.internal", allowed), true);
    assert.equal(isAllowedOrigin("http://localhost:3000", "localhost:3000", []), true);
  });

  it("rejects foreign, missing, malformed and look-alike origins", () => {
    assert.equal(isAllowedOrigin("https://evil.example", "example.com", allowed), false);
    assert.equal(isAllowedOrigin(null, "example.com", allowed), false);
    assert.equal(isAllowedOrigin("null", "example.com", allowed), false);
    assert.equal(isAllowedOrigin("https://example.com.evil.io", "example.com", allowed), false);
    assert.equal(isAllowedOrigin("http://localhost:3000", "localhost:4000", []), false);
  });
});
