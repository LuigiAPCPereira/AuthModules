import { render, screen, fireEvent } from "@testing-library/react";
import EmailVerification from "./EmailVerification";
import { describe, it, expect, vi } from "vitest";

describe("EmailVerification Component", () => {
  it("allows entering digits", () => {
    render(<EmailVerification />);
    const inputs = screen.getAllByRole("textbox", { name: /Dígito/i });
    expect(inputs).toHaveLength(6);

    const firstInput = inputs[0] as HTMLInputElement;
    fireEvent.change(firstInput, { target: { value: "1" } });

    expect(firstInput.value).toBe("1");
  });

  it("ignores non-digit input", () => {
    render(<EmailVerification />);
    const inputs = screen.getAllByRole("textbox", { name: /Dígito/i });

    const firstInput = inputs[0] as HTMLInputElement;
    fireEvent.change(firstInput, { target: { value: "a" } });

    expect(firstInput.value).toBe("");
  });

  it("handles backspace", () => {
    render(<EmailVerification />);
    const inputs = screen.getAllByRole("textbox", { name: /Dígito/i });

    fireEvent.change(inputs[0], { target: { value: "1" } });
    fireEvent.change(inputs[1], { target: { value: "2" } });
    expect((inputs[1] as HTMLInputElement).value).toBe("2");

    fireEvent.change(inputs[1], { target: { value: "" } });
    expect((inputs[1] as HTMLInputElement).value).toBe("");
  });

  it("displays error message on verification failure", async () => {
    const onVerifyMock = vi.fn().mockRejectedValue(new Error("Verification failed"));
    render(<EmailVerification onVerify={onVerifyMock} />);
    const inputs = screen.getAllByRole("textbox", { name: /Dígito/i });

    for (let i = 0; i < 6; i++) {
        fireEvent.change(inputs[i], { target: { value: String(i + 1) } });
    }

    await screen.findByText("Verification failed");
  });
});
