import { render, screen, waitFor } from "@testing-library/react";
import App from "@/App";
import { describe, it, expect, vi } from "vitest";

// Mock matchMedia for ThemeProvider
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("App", () => {
  it("renders the application title", async () => {
    render(<App />);

    // Check for "Entrar" heading from the LoginForm which is the default route
    await waitFor(() => {
        expect(screen.getByRole("heading", { name: "Entrar" })).toBeInTheDocument();
    });
  });

  it("renders the theme toggle button", async () => {
    render(<App />);

    await waitFor(() => {
        expect(screen.getByRole("button", { name: "Alternar tema" })).toBeInTheDocument();
    });
  });
});
