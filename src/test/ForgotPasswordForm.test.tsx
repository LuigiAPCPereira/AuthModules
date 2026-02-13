import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { describe, it, expect, vi } from "vitest";

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

  it("handles submission error with generic message", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Network error"));
    render(<ForgotPasswordForm onSubmit={onSubmit} />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /enviar link/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Erro de conexão. Verifique sua internet e tente novamente.")).toBeInTheDocument();
    });
  });

  it("handles submission error with specific message from object", async () => {
    // Simulating an error object that might be returned by an API
    // Note: getAuthErrorMessage falls back to generic error if it doesn't recognize the error structure
    const errorObj = { message: "Custom error message" };
    // We need to reject with this object.
    const onSubmit = vi.fn().mockImplementation(() => Promise.reject(errorObj));

    render(<ForgotPasswordForm onSubmit={onSubmit} />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /enviar link/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Ocorreu um erro inesperado. Tente novamente.")).toBeInTheDocument();
    });
  });

  it("handles submission error with empty message (fallback)", async () => {
      const errorObj = { message: "" };
      const onSubmit = vi.fn().mockImplementation(() => Promise.reject(errorObj));

      render(<ForgotPasswordForm onSubmit={onSubmit} />);

      const emailInput = screen.getByPlaceholderText("seu@email.com");
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      const submitButton = screen.getByRole("button", { name: /enviar link/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Ocorreu um erro inesperado. Tente novamente.")).toBeInTheDocument();
      });
  });

  it("handles submission error with null message (fallback)", async () => {
    const errorObj = { message: null };
    const onSubmit = vi.fn().mockImplementation(() => Promise.reject(errorObj));

    render(<ForgotPasswordForm onSubmit={onSubmit} />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /enviar link/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Ocorreu um erro inesperado. Tente novamente.")).toBeInTheDocument();
    });
  });
});
