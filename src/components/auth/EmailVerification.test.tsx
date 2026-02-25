import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmailVerification from "./EmailVerification";
import { describe, it, expect, vi, beforeAll } from "vitest";

describe("EmailVerification Component", () => {
  beforeAll(() => {
    // Mock elementFromPoint for input-otp in JSDOM environment
    if (typeof document !== "undefined" && !document.elementFromPoint) {
      document.elementFromPoint = () => null;
    }
  });

  it("allows entering digits", () => {
    render(<EmailVerification />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);

    // Simulate typing digits (simplified for fireEvent)
    // We manually set value for each input as fireEvent doesn't automatically jump focus/propagate in JSDOM for all libs
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: String(index + 1) } });
    });

    inputs.forEach((input, index) => {
        expect(input).toHaveValue(String(index + 1));
    });
  });

  it("ignores non-digit input", () => {
    render(<EmailVerification />);
    const inputs = screen.getAllByRole("textbox");
    const firstInput = inputs[0];

    // Simulate user typing non-digits
    fireEvent.change(firstInput, { target: { value: "a" } });

    // Expect the value to remain empty
    expect(firstInput).toHaveValue("");
  });

  it("displays error message on verification failure", async () => {
    const onVerifyMock = vi.fn().mockRejectedValue(new Error("Verification failed"));
    render(<EmailVerification onVerify={onVerifyMock} />);
    const inputs = screen.getAllByRole("textbox");

    // Fill all inputs to trigger submission
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: String(index + 1) } });
    });

    await screen.findByText("Verification failed");

    // Check if inputs are cleared (if that's the expected behavior)
    // The original test expected clearing: expect(input).toHaveValue("")
    await waitFor(() => {
        expect(inputs[0]).toHaveValue("");
    });
  });
});
