import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import EmailVerification from "./EmailVerification";
import { describe, it, expect, vi, beforeAll } from "vitest";

describe("EmailVerification Component", () => {
  beforeAll(() => {
    // Mock elementFromPoint for input-otp in JSDOM environment
    if (typeof document !== "undefined" && !document.elementFromPoint) {
      document.elementFromPoint = () => null;
    }
  });

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("allows entering digits", () => {
    render(<EmailVerification />);
    const input = screen.getByRole("textbox");
    act(() => {
      fireEvent.change(input, { target: { value: "123456" } });
    });
    expect(input).toHaveValue("123456");
  });

  it("ignores non-digit input", () => {
    render(<EmailVerification />);
    const input = screen.getByRole("textbox");

    // Simulate user typing non-digits
    act(() => {
      fireEvent.change(input, { target: { value: "abc" } });
    });

    // Expect the value to remain empty because the component regex check prevents state update
    expect(input).toHaveValue("");
  });

  it("displays error message on verification failure", async () => {
    const onVerifyMock = vi.fn().mockRejectedValue(new Error("Verification failed"));
    render(<EmailVerification onVerify={onVerifyMock} />);
    const input = screen.getByRole("textbox");

    act(() => {
      fireEvent.change(input, { target: { value: "123456" } });
    });

    await screen.findByText("Verification failed");
    await waitFor(() => expect(input).toHaveValue(""));
  });
});
