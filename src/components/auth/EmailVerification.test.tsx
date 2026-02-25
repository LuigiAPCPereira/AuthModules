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

  it("submits the code when full 6 digits are provided (happy path)", async () => {
    const onVerifyMock = vi.fn().mockResolvedValue(undefined);
    render(<EmailVerification onVerify={onVerifyMock} />);
    const input = screen.getByRole("textbox");

    act(() => {
      // With InputOTP, filling all characters triggers onComplete
      fireEvent.change(input, { target: { value: "123456" } });
    });

    // onComplete should have been called successfully
    await waitFor(() => {
      expect(onVerifyMock).toHaveBeenCalledWith("123456");
      expect(onVerifyMock).toHaveBeenCalledTimes(1);
    });
  });

  it("shows loading state during submission", async () => {
    let resolveVerification!: () => void;
    const onVerifyMock = vi.fn().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveVerification = resolve;
        })
    );
    render(<EmailVerification onVerify={onVerifyMock} />);
    const input = screen.getByRole("textbox");

    act(() => {
      fireEvent.change(input, { target: { value: "123456" } });
    });

    // A spinner or disabled state should be present
    expect(input).toBeDisabled();

    // Finish request
    act(() => {
      resolveVerification();
    });

    await waitFor(() => {
      expect(input).not.toBeDisabled();
    });
  });

  it("handles resend flow", async () => {
    const onResendMock = vi.fn().mockResolvedValue(undefined);
    render(<EmailVerification onResend={onResendMock} />);

    const resendButton = screen.getByRole("button", { name: "Reenviar" });

    act(() => {
      fireEvent.click(resendButton);
    });

    expect(onResendMock).toHaveBeenCalledTimes(1);
  });
});
