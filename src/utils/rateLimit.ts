/**
 * Simple client-side rate limit utility to prevent brute force clicking
 */
export interface RateLimitStatus {
    allowed: boolean;
    remainingMs: number;
}

export const rateLimit = {
    check(action: string, maxAttempts: number = 5, windowMinutes: number = 15): RateLimitStatus {
        if (typeof window === "undefined") return { allowed: true, remainingMs: 0 }; // allow if SSR

        const key = `ratelimit_${action}`;
        const now = Date.now();
        const windowMs = windowMinutes * 60 * 1000;

        let history: number[] = [];
        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                history = JSON.parse(stored);
            }
        } catch {
            // Ignore parse errors
        }

        // Filter out attempts older than the window
        history = history.filter((timestamp) => now - timestamp < windowMs);

        if (history.length >= maxAttempts) {
            // Find the oldest attempt in the window to calculate time remaining
            const oldest = history[0];
            const remainingMs = windowMs - (now - oldest);
            return { allowed: false, remainingMs };
        }

        // Record this attempt
        history.push(now);
        localStorage.setItem(key, JSON.stringify(history));

        return { allowed: true, remainingMs: 0 };
    },

    reset(action: string) {
        if (typeof window !== "undefined") {
            localStorage.removeItem(`ratelimit_${action}`);
        }
    }
};
