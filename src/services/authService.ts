import { supabase } from "./supabaseClient";

/**
 * Interface with auth methods decoupling UI from the implementation details
 */
export const authService = {
    /**
     * Login with email and password
     */
    async signInWithPassword(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    /**
     * Register with email, password, and name
     */
    async signUp(email: string, password: string, name: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name },
            },
        });
        if (error) throw error;
        return data;
    },

    /**
     * Log out the current session
     */
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /**
     * Trigger OAuth sign in, e.g. for Google
     */
    async signInWithOAuth(provider: "google") {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            }
        });
        if (error) throw error;
        return data;
    },

    /**
     * Fetch current authenticated session
     */
    async getSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;
    },

    /**
     * Fetch current authenticated user
     */
    async getUser() {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        return data.user;
    },
};
