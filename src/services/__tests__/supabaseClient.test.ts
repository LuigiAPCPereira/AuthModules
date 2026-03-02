import { describe, it, expect, beforeEach, vi } from "vitest";
import { initializeSupabase, supabase } from "../supabaseClient";
import * as SupabaseJS from "@supabase/supabase-js";

// Mock the createClient from Supabase to prevent real network calls
vi.mock("@supabase/supabase-js", () => ({
    createClient: vi.fn(() => ({
        auth: {},
        from: vi.fn(),
    })),
}));

describe("supabaseClient", () => {
    beforeEach(() => {
        // We need to clear the exported singleton between tests to test the initialization logic.
        // Because `supabase` is an exported let, we can't easily re-assign it without a helper.
        // Since we are mocking the module, we can trick the initialization logic by
        // relying on the module's behavior. We can try to clear module cache, but simpler
        // is to test the error path first since it doesn't initialize it.
    });

    it("throws an error when url or key are missing", () => {
        // Test missing URL
        expect(() => initializeSupabase("", "key")).toThrow(
            "Critical Configuration Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be provided."
        );

        // Test missing Key
        expect(() => initializeSupabase("url", "")).toThrow(
            "Critical Configuration Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be provided."
        );

        // Test both missing
        expect(() => initializeSupabase("", "")).toThrow(
            "Critical Configuration Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be provided."
        );
    });

    it("initializes Supabase client when url and key are provided", () => {
        const client = initializeSupabase("https://valid-url.supabase.co", "valid-key");

        expect(SupabaseJS.createClient).toHaveBeenCalledWith(
            "https://valid-url.supabase.co",
            "valid-key"
        );
        expect(client).toBeDefined();
        // Since it's a singleton, calling it again should return the same instance and not call createClient again
        const client2 = initializeSupabase("https://another.url", "another-key");
        expect(SupabaseJS.createClient).toHaveBeenCalledTimes(1);
        expect(client2).toBe(client);
    });
});
