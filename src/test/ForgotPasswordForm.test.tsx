import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { describe, it, expect, vi } from "vitest";
import { AUTH_ERROR_MESSAGES } from "@/lib/errorMessages";

describe("ForgotPasswordForm", () => {
  it("renders correctly", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByText("Esqueceu a senha?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("seu@email.com")).toBeInTheDocument();
  });

  it("submits the form with valid email", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ForgotPasswordForm onSubmit={onSubmit} />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /enviar link/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("test@example.com");
    });

    expect(screen.getByText("E-mail enviado")).toBeInTheDocument();
  });

  it("shows error when email is invalid", async () => {
    render(<ForgotPasswordForm />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    const submitButton = screen.getByRole("button", { name: /enviar link/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
    });
  });

  it("handles network error by showing error message", async () => {
    // Simulate a network error (which getAuthErrorMessage detects by 'network' or 'conexão' string)
    const onSubmit = vi.fn().mockRejectedValue(new Error("Network connection failed"));
    render(<ForgotPasswordForm onSubmit={onSubmit} />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /enviar link/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(AUTH_ERROR_MESSAGES.NETWORK_ERROR)).toBeInTheDocument();
    });
  });

  it("swallows generic errors and shows success (User Enumeration Prevention)", async () => {
    // Simulating an error object that implies 'Email not found' or other server errors
    // The message doesn't match network/server unavailable, so it should be swallowed.
    const errorObj = { message: "Email not found" };
    const onSubmit = vi.fn().mockRejectedValue(errorObj);

    render(<ForgotPasswordForm onSubmit={onSubmit} />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /enviar link/i });
    fireEvent.click(submitButton);

    // Expect success screen instead of error
    await waitFor(() => {
      expect(screen.getByText("E-mail enviado")).toBeInTheDocument();
    });
  });

  it("swallows empty/null errors and shows success (User Enumeration Prevention)", async () => {
    const errorObj = { message: "" };
    const onSubmit = vi.fn().mockRejectedValue(errorObj);

    render(<ForgotPasswordForm onSubmit={onSubmit} />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /enviar link/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("E-mail enviado")).toBeInTheDocument();
    });
  });
});
