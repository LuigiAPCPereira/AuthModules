import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";

interface AuthState {
    user: User | null;
    session: Session | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    setLoading: (isLoading: boolean) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true, // starts loading until hydration happens
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setSession: (session) => set({ session, isAuthenticated: !!session?.user, user: session?.user ?? null }),
    setLoading: (isLoading) => set({ isLoading }),
    clearAuth: () => set({ user: null, session: null, isAuthenticated: false, isLoading: false }),
}));
