import { render, screen } from "@testing-library/react";
import AuthInput from "../components/auth/AuthInput";
import { describe, it, expect, vi, beforeAll } from "vitest";

describe("AuthInput Accessibility", () => {
  beforeAll(() => {
    window.scrollTo = vi.fn();
  });

  it("renders with label associated to input when id is provided", () => {
    render(<AuthInput label="Test Label" id="test-id" />);
    const input = screen.getByLabelText("Test Label");
    expect(input).toBeInTheDocument();
    expect(input.id).toBe("test-id");
  });

  it("renders with label associated to input even when id is NOT provided (auto-generated)", () => {
    render(<AuthInput label="Auto ID Label" />);

    const input = screen.getByLabelText("Auto ID Label");
    expect(input).toBeInTheDocument();
    expect(input.id).toBeTruthy(); // Should have SOME ID
    expect(input.id).not.toBe("");
  });

  it("associates aria-describedby with error message when error is provided", () => {
    render(<AuthInput label="Error Label" error="Some error" />);

    const errorNode = screen.getByText("Some error");
    expect(errorNode.id).toBeTruthy();

    const input = screen.getByLabelText("Error Label");
    expect(input.getAttribute("aria-describedby")).toBe(errorNode.id);
  });

  it("shows required indicator when required prop is passed", () => {
    // Label will be "Required Label *" because of the indicator
    // But getByLabelText usually matches the text content of the label
    // We can use a regex to be flexible
    render(<AuthInput label="Required Label" required />);

    // Check if the asterisk is present in the document
    const indicator = screen.getByText("*");
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass("text-destructive");
    expect(indicator).toHaveAttribute("aria-hidden", "true");

    // Verify the input has required attribute
    // Note: getByLabelText might need to include the asterisk in the query or use regex
    const input = screen.getByLabelText(/Required Label/);
    expect(input).toBeRequired();
  });

  it("does not show required indicator when required prop is missing", () => {
    render(<AuthInput label="Optional Label" />);

    const indicator = screen.queryByText("*");
    expect(indicator).not.toBeInTheDocument();

    const input = screen.getByLabelText("Optional Label");
    expect(input).not.toBeRequired();
  });
});
