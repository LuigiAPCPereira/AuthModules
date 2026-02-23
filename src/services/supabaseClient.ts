import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Export the singleton supabase client to be initialized
export let supabase: SupabaseClient;

/**
 * Initializes the Supabase client. To be called by AuthProvider before rendering.
 */
export const initializeSupabase = (url: string, key: string) => {
    if (!supabase) {
        // Provide a fallback dummy URL and KEY ONLY if both are missing (e.g. tests)
        const finalUrl = url || "https://placeholder-project.supabase.co";
        const finalKey = key || "placeholder-anon-key";

        supabase = createClient(finalUrl, finalKey);
    }
    return supabase;
};

export const isBrowser = typeof window !== "undefined";
