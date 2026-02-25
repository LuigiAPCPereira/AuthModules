import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "../../store/authStore";
import { useUser } from "../useUser";
import { useSession } from "../useSession";
import { User, Session } from "@supabase/supabase-js";

describe("Auth Hooks", () => {
    beforeEach(() => {
        // Reset Zustand state before each test
        const store = useAuthStore.getState();
        store.clearAuth();
        store.setLoading(false);
    });

    const mockUser: User = { id: "1", email: "test@test.com", app_metadata: {}, user_metadata: {}, aud: "authenticated", created_at: "" };
    const mockSession: Session = { access_token: "token", refresh_token: "refresh", expires_in: 3600, token_type: "bearer", user: mockUser };

    describe("useUser", () => {
        it("should return null initially", () => {
            const { result } = renderHook(() => useUser());
            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
        });

        it("should return user when authenticated", () => {
            act(() => {
                useAuthStore.getState().setUser(mockUser);
            });
            const { result } = renderHook(() => useUser());
            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isAuthenticated).toBe(true);
        });
    });

    describe("useSession", () => {
        it("should return null initially", () => {
            const { result } = renderHook(() => useSession());
            expect(result.current.session).toBeNull();
            expect(result.current.isLoading).toBe(false);
        });

        it("should return session and tokens when authenticated", () => {
            act(() => {
                useAuthStore.getState().setSession(mockSession);
            });
            const { result } = renderHook(() => useSession());
            expect(result.current.session).toEqual(mockSession);
            expect(result.current.accessToken).toBe("token");
            expect(result.current.refreshToken).toBe("refresh");
        });
    });
});
