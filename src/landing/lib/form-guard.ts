import "server-only";

// Shared protection for the landing's public form endpoints:
// body size limit, per-IP rate limit and reCAPTCHA v3 verification.

/** Reads a JSON body of at most `maxBytes`; undefined if too large or not JSON. */
export async function readJsonBody(request: Request, maxBytes = 16_384): Promise<unknown> {
  if (Number(request.headers.get("content-length") ?? 0) > maxBytes) return undefined;
  const text = await request.text();
  if (text.length > maxBytes) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

const hits = new Map<string, number[]>();

/**
 * Sliding-window limit per key (route + IP). The memory belongs to one server
 * instance, so on serverless hosting it slows abuse down rather than stopping
 * it outright; reCAPTCHA is the main gate.
 */
export function isRateLimited(key: string, limit = 5, windowMs = 10 * 60_000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter(t => now - t < windowMs);
  const limited = recent.length >= limit;
  if (!limited) recent.push(now);
  hits.set(key, recent);

  if (hits.size > 10_000) {
    for (const [k, times] of hits) if (times.every(t => now - t >= windowMs)) hits.delete(k);
  }
  return limited;
}

export type CaptchaResult = "ok" | "failed" | "unconfigured";

/** reCAPTCHA v3: valid token, a human-looking score, and the expected action. */
export async function verifyRecaptcha(token: string, action: string): Promise<CaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return "unconfigured";

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    });
    const data: { success?: boolean; score?: number; action?: string } = await response.json();
    return data.success && (data.score ?? 0) >= 0.5 && data.action === action ? "ok" : "failed";
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return "failed";
  }
}

/**
 * Without RECAPTCHA_SECRET_KEY the forms keep working in development (so the
 * site runs without keys) but are refused in production.
 */
export const allowWithoutCaptcha = () => process.env.NODE_ENV !== "production";
