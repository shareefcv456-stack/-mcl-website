// ponytail: in-memory fixed window, per server instance. On serverless / multi-instance hosting
// each instance counts separately — move to a shared store (e.g. Redis) if abuse shows up.

interface Window {
  count: number;
  resetAt: number;
}

export interface RateLimiter {
  /** Returns 0 when allowed, otherwise the seconds until the caller may retry. */
  check(key: string, now?: number): number;
}

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }): RateLimiter {
  const windows = new Map<string, Window>();
  return {
    check(key, now = Date.now()) {
      if (windows.size > 10_000) {
        for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);
      }
      const w = windows.get(key);
      if (!w || w.resetAt <= now) {
        windows.set(key, { count: 1, resetAt: now + windowMs });
        return 0;
      }
      if (w.count >= limit) return Math.ceil((w.resetAt - now) / 1000);
      w.count++;
      return 0;
    },
  };
}

/**
 * Best-effort client IP from proxy headers; falls back to a shared bucket.
 * Deploy behind a proxy/platform that overwrites X-Forwarded-For (Vercel, nginx, Cloudflare…):
 * if `next start` is exposed directly, clients can spoof this header to dodge the limit.
 */
export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}
