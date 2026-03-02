import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";

// We need to mock import.meta.env
vi.stubEnv("VITE_SUPABASE_URL", "http://localhost:54321");
vi.stubEnv("VITE_SUPABASE_ANON_KEY", "dummy-anon-key");
vi.stubEnv("BASE_URL", "/");

vi.mock("../services/supabaseClient", () => {
  return {
    initializeSupabase: vi.fn(),
    supabase: {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      }
    }
  }
})

describe("App", () => {
  it("renders without crashing", () => {
    // Because App loads lazy features, and we test components with react context
    // It's mostly just ensuring the root component renders
    // Some routes might complain or do async things, so a simple snapshot/render test
    const { container } = render(<App />);
    expect(container).toBeDefined();
  });
});
