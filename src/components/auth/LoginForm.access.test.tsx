import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LoginForm from "@/components/auth/LoginForm";

describe("LoginForm Accessibility", () => {
  it("renders 'Remember me' checkbox with correct label association", () => {
    render(<LoginForm />);

    // Check if label exists
    const label = screen.getByText("Lembrar de mim");
    expect(label).toBeInTheDocument();

    // Check if checkbox exists and is associated with label
    // Radix UI Checkbox renders as a button with role="checkbox"
    const checkbox = screen.getByRole("checkbox", { name: "Lembrar de mim" });
    expect(checkbox).toBeInTheDocument();

    // Verify id association
    expect(checkbox).toHaveAttribute("id", "remember-me");
    expect(label).toHaveAttribute("for", "remember-me");
  });

  it("toggles 'Remember me' checkbox state", () => {
    render(<LoginForm />);

    const checkbox = screen.getByRole("checkbox", { name: "Lembrar de mim" });

    // Initial state (unchecked by default)
    // Radix checkbox uses aria-checked
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    // Click label to toggle
    const label = screen.getByText("Lembrar de mim");
    fireEvent.click(label);

    // Expect checked
    expect(checkbox).toHaveAttribute("aria-checked", "true");

    // Click checkbox to toggle back
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });
});
