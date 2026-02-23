import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined);
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined);

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing. Check your environment variables.");
}

// Provide a fallback dummy URL and KEY ONLY if both are missing AND we're in a test environment (or similar) to avoid crashing.
// In production, missing these vars will lead to actual connection errors, but for unit tests, creating the client shouldn't throw.
const finalUrl = supabaseUrl || "https://placeholder-project.supabase.co";
const finalKey = supabaseAnonKey || "placeholder-anon-key";

export const supabase = createClient(finalUrl, finalKey);

export const isBrowser = typeof window !== "undefined";
