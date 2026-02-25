import Cookies from "js-cookie";

export const cookieStorage = {
    get(key: string): string | undefined {
        // Need to handle SSR in Next.js, so we safely return undefined if window isn't defined
        // For universal Next.js server compatibility, user should pass the cookie via context,
        // but this abstraction focuses on client-side JS / browser env.
        if (typeof window === "undefined") return undefined;
        return Cookies.get(key);
    },

    set(key: string, value: string, options?: Cookies.CookieAttributes) {
        if (typeof window === "undefined") return;
        Cookies.set(key, value, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            ...options,
        });
    },

    remove(key: string, options?: Cookies.CookieAttributes) {
        if (typeof window === "undefined") return;
        Cookies.remove(key, options);
    },
};
