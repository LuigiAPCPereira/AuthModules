import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AuthInput from "../../../components/auth/AuthInput";

describe("AuthInput Accessibility", () => {
  it("should generate an ID when none is provided", () => {
    render(<AuthInput label="Test Label" />);

    const input = screen.getByRole("textbox");
    const label = screen.getByText("Test Label");

    expect(input.id).toBeDefined();
    expect(input.id).not.toBe("");
    expect(label.getAttribute("for")).toBe(input.id);
  });

  it("should use the provided ID", () => {
    const testId = "custom-id";
    render(<AuthInput label="Test Label" id={testId} />);

    const input = screen.getByRole("textbox");
    const label = screen.getByText("Test Label");

    expect(input.id).toBe(testId);
    expect(label.getAttribute("for")).toBe(testId);
  });

  it("should associate error message via aria-describedby", () => {
    const errorMessage = "Invalid input";
    render(<AuthInput label="Test Label" error={errorMessage} />);

    const input = screen.getByRole("textbox");
    const error = screen.getByRole("alert");

    // Check if error message is rendered
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(errorMessage);

    // Check association
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeDefined();
    expect(describedBy).toBe(error.id);

    // Ensure IDs are consistent
    expect(error.id).toBe(`${input.id}-error`);
  });
});
