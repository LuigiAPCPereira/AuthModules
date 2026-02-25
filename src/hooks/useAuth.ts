import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useAuthStore } from "../store/authStore";

/**
 * Hook to access authentication methods and current high-level state.
 * Replaces the old monolithic useAuth by composing Context (actions) and Zustand (state).
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    // Reactive state from Zustand store
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isLoading = useAuthStore((state) => state.isLoading);
    const user = useAuthStore((state) => state.user);

    return {
        ...context,
        state: {
            isAuthenticated,
            isLoading,
            user,
        }
    };
};
