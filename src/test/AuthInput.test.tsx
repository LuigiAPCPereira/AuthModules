
import { render, screen } from "@testing-library/react";
import AuthInput from "../components/auth/AuthInput";
import { describe, it, expect } from "vitest";

describe("AuthInput Accessibility", () => {
  it("renders with label associated to input when id is provided", () => {
    render(<AuthInput label="Test Label" id="test-id" />);
    const input = screen.getByLabelText("Test Label");
    expect(input).toBeInTheDocument();
    expect(input.id).toBe("test-id");
  });

  it("renders with label associated to input even when id is NOT provided (auto-generated)", () => {
    // Before fix: This would fail because htmlFor would be undefined.
    // After fix: This should pass because an ID is auto-generated.
    render(<AuthInput label="Auto ID Label" />);

    const input = screen.getByLabelText("Auto ID Label");
    expect(input).toBeInTheDocument();
    expect(input.id).toBeTruthy(); // Should have SOME ID
    expect(input.id).not.toBe("");
  });
});
