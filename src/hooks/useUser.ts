import { useAuthStore } from "../store/authStore";

/**
 * Dedicated hook to access only user information.
 * Causes re-renders only when user data changes.
 */
export const useUser = () => {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return {
        user,
        isAuthenticated,
    };
};
