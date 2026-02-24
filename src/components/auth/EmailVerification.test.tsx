import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmailVerification from "./EmailVerification";
import { describe, it, expect, vi, beforeAll } from "vitest";

describe("EmailVerification Component", () => {
  beforeAll(() => {
    if (typeof document !== "undefined" && !document.elementFromPoint) {
      document.elementFromPoint = () => null;
    }
  });

  it("allows entering digits", async () => {
    render(<EmailVerification />);
    const input = screen.getByLabelText(/código de verificação/i);
    fireEvent.change(input, { target: { value: "123456" } });
    await waitFor(() => expect(input).toHaveValue("123456"));
    // Wait for any pending effects to avoid "window is not defined" after teardown
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  it("ignores non-digit input", async () => {
    render(<EmailVerification />);
    const input = screen.getByLabelText(/código de verificação/i);
    fireEvent.change(input, { target: { value: "abc" } });
    expect(input).toHaveValue("");
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  it("displays error message on verification failure", async () => {
    const onVerifyMock = vi.fn().mockRejectedValue(new Error("Verification failed"));
    render(<EmailVerification onVerify={onVerifyMock} />);
    const input = screen.getByLabelText(/código de verificação/i);

    fireEvent.change(input, { target: { value: "123456" } });

    const errorMessage = await screen.findByText("Verification failed");

    expect(errorMessage).toHaveAttribute("role", "alert");
    expect(input).toHaveAttribute("aria-describedby", errorMessage.id);
    expect(input).toHaveAttribute("aria-invalid", "true");

    await waitFor(() => expect(input).toHaveValue(""));
    await new Promise((resolve) => setTimeout(resolve, 50));
  });
});
