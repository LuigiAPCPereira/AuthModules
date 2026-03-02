import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Export the singleton supabase client to be initialized
export let supabase: SupabaseClient;

/**
 * Initializes the Supabase client. To be called by AuthProvider before rendering.
 */
export const initializeSupabase = (url: string, key: string) => {
    if (!supabase) {
        // Security: Prevent app from silently running against a rogue or unintended
        // fallback instance if environment variables are missing. Fail securely.
        if (!url || !key) {
            throw new Error("Critical Configuration Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be provided.");
        }

        supabase = createClient(url, key);
    }
    return supabase;
};

export const isBrowser = typeof window !== "undefined";
