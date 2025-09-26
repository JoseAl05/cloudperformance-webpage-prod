// CAMBIAR ESTO PARA MANEJARLO CON REDIS (BACKLOG)
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (existing.count >= limit) return { allowed: false, remaining: 0 };
  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count };
}