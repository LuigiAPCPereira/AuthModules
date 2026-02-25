// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, createEvent } from "@testing-library/react";
import AuthInput from "@/components/auth/AuthInput";

describe("AuthInput A11y", () => {
  it("uses internal error ID in aria-describedby when error is present", () => {
    render(<AuthInput label="Test" id="test-input" error="Something went wrong" />);
    const input = screen.getByLabelText(/Test/i);
    expect(input).toHaveAttribute("aria-describedby", "test-input-error");
  });

  it("uses external aria-describedby when provided", () => {
    render(<AuthInput label="Test" id="test-input" aria-describedby="external-helper" />);
    const input = screen.getByLabelText(/Test/i);
    expect(input).toHaveAttribute("aria-describedby", "external-helper");
  });

  it("combines error ID and external aria-describedby", () => {
    render(
      <AuthInput
        label="Test"
        id="test-input"
        error="Something went wrong"
        aria-describedby="external-helper"
      />
    );
    const input = screen.getByLabelText(/Test/i);
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toContain("test-input-error");
    expect(describedBy).toContain("external-helper");
  });

  it("combines caps lock warning ID and external aria-describedby", () => {
    render(
      <AuthInput
        label="Password"
        id="password-input"
        type="password"
        aria-describedby="external-helper"
      />
    );

    const input = screen.getByLabelText(/Password/i);

    // Create a custom event with mocked getModifierState
    const event = createEvent.keyDown(input, { key: "A", code: "KeyA" });
    Object.defineProperty(event, "getModifierState", {
      value: (key: string) => key === "CapsLock",
    });

    fireEvent(input, event);

    // Caps warning renders with animation, so we might need to check immediately or wait.
    // Since it's conditional rendering, we check if the element exists and if aria-describedby is updated.

    // Check if warning message appeared
    const warning = screen.getByText("Caps Lock ativado");
    expect(warning).toBeInTheDocument();
    expect(warning).toHaveAttribute("id", "password-input-caps-warning");

    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toContain("password-input-caps-warning");
    expect(describedBy).toContain("external-helper");
  });
});
