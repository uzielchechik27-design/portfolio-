import { afterEach, describe, expect, it } from "vitest";
import {
  TWIN_RATE_LIMIT,
  TWIN_RATE_WINDOW_MS,
  clientAddress,
  resetRateLimiter,
  takeRateLimit,
} from "@/lib/rate-limit";

describe("twin rate limit", () => {
  afterEach(() => {
    resetRateLimiter();
  });

  it("reads the client IP from proxy headers", () => {
    expect(
      clientAddress(
        new Request("http://localhost/api/twin", {
          headers: { "x-forwarded-for": "203.0.113.10, 10.0.0.1" },
        }),
      ),
    ).toBe("203.0.113.10");
    expect(
      clientAddress(
        new Request("http://localhost/api/twin", {
          headers: { "x-real-ip": "2001:db8::1" },
        }),
      ),
    ).toBe("2001:db8::1");
    expect(
      clientAddress(
        new Request("http://localhost/api/twin", {
          headers: { "x-forwarded-for": "not an ip" },
        }),
      ),
    ).toBe("unknown");
  });

  it("allows a burst and then asks the caller to wait", () => {
    const now = 1_000_000;
    for (let index = 0; index < TWIN_RATE_LIMIT; index += 1) {
      expect(takeRateLimit("203.0.113.10", now + index).allowed).toBe(true);
    }

    const blockedAt = now + TWIN_RATE_LIMIT;
    const blocked = takeRateLimit("203.0.113.10", blockedAt);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(
      Math.ceil((now + TWIN_RATE_WINDOW_MS - blockedAt) / 1000),
    );
    expect(takeRateLimit("203.0.113.11", now + TWIN_RATE_LIMIT).allowed).toBe(
      true,
    );
  });

  it("forgets hits outside the window", () => {
    expect(takeRateLimit("203.0.113.10", 0).allowed).toBe(true);
    expect(
      takeRateLimit("203.0.113.10", TWIN_RATE_WINDOW_MS + 1).allowed,
    ).toBe(true);
  });
});
