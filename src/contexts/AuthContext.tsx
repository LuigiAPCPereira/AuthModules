import { createContext, useEffect, ReactNode } from "react";
import { supabase } from "../services/supabaseClient";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { cookieStorage } from "../utils/cookies";

export interface AuthContextValue {
  login: typeof authService.signInWithPassword;
  signup: typeof authService.signUp;
  logout: typeof authService.signOut;
  loginWithGoogle: () => ReturnType<typeof authService.signInWithOAuth>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const setSession = useAuthStore((state) => state.setSession);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!error) {
        setSession(session);
        if (session) {
          cookieStorage.set("sb-access-token", session.access_token);
          cookieStorage.set("sb-refresh-token", session.refresh_token);
        }
      }
      setLoading(false);
    });

    // Listen to changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        cookieStorage.set("sb-access-token", session.access_token);
        cookieStorage.set("sb-refresh-token", session.refresh_token);
      } else {
        cookieStorage.remove("sb-access-token");
        cookieStorage.remove("sb-refresh-token");
      }
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
