/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { rateLimit } from "../rateLimit";

describe("rateLimit", () => {
    beforeEach(() => {
        const mockStorage: Record<string, string> = {};
        global.localStorage = {
            getItem: vi.fn((key: string) => mockStorage[key] || null),
            setItem: vi.fn((key: string, val: string) => mockStorage[key] = val),
            removeItem: vi.fn((key: string) => delete mockStorage[key]),
            clear: vi.fn(() => {
                for (const key in mockStorage) delete mockStorage[key];
            }),
        } as unknown as Storage;

        localStorage.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should allow initial attempt", () => {
        const result = rateLimit.check("test_action", 5, 15);
        expect(result.allowed).toBe(true);
        expect(result.remainingMs).toBe(0);
    });

    it("should block after max attempts", () => {
        // 5 allowed attempts
        for (let i = 0; i < 5; i++) {
            rateLimit.check("test_action", 5, 15);
        }

        // 6th attempt should be blocked
        const result = rateLimit.check("test_action", 5, 15);
        expect(result.allowed).toBe(false);
        expect(result.remainingMs).toBeGreaterThan(0);
    });

    it("should reset properly", () => {
        rateLimit.check("test_action", 1, 15); // limit is 1
        const blocked = rateLimit.check("test_action", 1, 15);
        expect(blocked.allowed).toBe(false);

        rateLimit.reset("test_action");
        const allowed = rateLimit.check("test_action", 1, 15);
        expect(allowed.allowed).toBe(true);
    });

    it("should allow attempts again after the time window expires", () => {
        rateLimit.check("test_action", 1, 15); // limit is 1
        const blocked = rateLimit.check("test_action", 1, 15);
        expect(blocked.allowed).toBe(false);

        // Advance time by 16 minutes
        vi.advanceTimersByTime(16 * 60 * 1000);

        const allowed = rateLimit.check("test_action", 1, 15);
        expect(allowed.allowed).toBe(true);
    });
});
