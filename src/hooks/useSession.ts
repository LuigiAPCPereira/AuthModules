import { useAuthStore } from "../store/authStore";

/**
 * Dedicated hook to access the raw Supabase session.
 * Useful for retrieving access_tokens for API calls.
 */
export const useSession = () => {
    const session = useAuthStore((state) => state.session);
    const isLoading = useAuthStore((state) => state.isLoading);

    return {
        session,
        accessToken: session?.access_token,
        refreshToken: session?.refresh_token,
        isLoading,
    };
};
