import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Index from "../Index";

// Mock lazy loaded components and others to simplify testing
vi.mock("@/components/auth/LoginForm", () => ({ default: () => <div data-testid="login-form">Login Form</div> }));
vi.mock("@/components/auth/SignupForm", () => ({ default: () => <div>Signup Form</div> }));
vi.mock("@/components/auth/ForgotPasswordForm", () => ({ default: () => <div>Forgot Password Form</div> }));
vi.mock("@/components/auth/ResetPasswordForm", () => ({ default: () => <div>Reset Password Form</div> }));
vi.mock("@/components/auth/EmailVerification", () => ({ default: () => <div>Email Verification</div> }));
vi.mock("@/components/auth/EmailVerified", () => ({ default: () => <div>Email Verified</div> }));
vi.mock("@/components/auth/LogoutCard", () => ({ default: () => <div>Logout Card</div> }));
vi.mock("@/components/auth/ThemeToggle", () => ({ default: () => <div>Theme Toggle</div> }));
vi.mock("@/components/auth/SkipLink", () => ({ default: () => <div>Skip Link</div> }));

describe("Index Page", () => {
  it("renders main content wrapper with correct ID and tabIndex for accessibility", async () => {
    render(<Index />);

    // Wait for initial render (login form is default)
    await waitFor(() => {
      expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });

    // Verify the main content wrapper exists and has accessibility attributes
    // querying by ID is appropriate here as the ID is the contract we are testing
    const mainContent = document.getElementById("main-content");

    expect(mainContent).toBeInTheDocument();
    expect(mainContent).toHaveAttribute("tabIndex", "-1");
    expect(mainContent).toHaveClass("focus:outline-none");
  });
});
