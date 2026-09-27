export const TWIN_RATE_LIMIT = 8;
export const TWIN_RATE_WINDOW_MS = 10 * 60 * 1000;

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const buckets = new Map<string, number[]>();

export function resetRateLimiter(): void {
  buckets.clear();
}

export function clientAddress(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const candidate = (forwarded?.split(",")[0] ?? realIp ?? "").trim();

  if (/^[A-Za-z0-9:.]+$/.test(candidate) && candidate.length <= 64) {
    return candidate;
  }

  return "unknown";
}

export function takeRateLimit(
  key: string,
  now = Date.now(),
): RateLimitResult {
  const windowStart = now - TWIN_RATE_WINDOW_MS;
  const hits = (buckets.get(key) ?? []).filter((stamp) => stamp > windowStart);

  if (hits.length >= TWIN_RATE_LIMIT) {
    const oldest = hits[0] ?? now;
    buckets.set(key, hits);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((oldest + TWIN_RATE_WINDOW_MS - now) / 1000),
      ),
    };
  }

  hits.push(now);
  buckets.set(key, hits);

  if (buckets.size > 5000) {
    for (const [bucketKey, stamps] of buckets) {
      if (stamps.every((stamp) => stamp <= windowStart)) {
        buckets.delete(bucketKey);
      }
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}
