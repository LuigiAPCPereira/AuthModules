import { createContext, useEffect, ReactNode } from "react";
import { supabase, initializeSupabase } from "../services/supabaseClient";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";

export interface AuthContextValue {
  login: typeof authService.signInWithPassword;
  signup: typeof authService.signUp;
  logout: typeof authService.signOut;
  loginWithGoogle: () => ReturnType<typeof authService.signInWithOAuth>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export const AuthProvider = ({ children, supabaseUrl, supabaseAnonKey }: AuthProviderProps) => {
  // Ensure the supabase client singleton is initialized safely
  if (!supabase) {
    initializeSupabase(supabaseUrl, supabaseAnonKey);
  }

  const setSession = useAuthStore((state) => state.setSession);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!error) {
        setSession(session);
      }
      setLoading(false);
    });

    // Listen to changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setLoading]);

  const value: AuthContextValue = {
    login: authService.signInWithPassword,
    signup: authService.signUp,
    logout: authService.signOut,
    loginWithGoogle: () => authService.signInWithOAuth("google"),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
