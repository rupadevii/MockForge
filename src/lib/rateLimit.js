import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const apiLimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    ephemeralCache: new Map(),
    prefix: "@upstash/apilimit",
    analytics: false,
});

export const createLimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    ephemeralCache: new Map(),
    prefix: "@upstash/createlimit",
    analytics: false,
});
