import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./LoginForm";
import { describe, it, expect, vi } from "vitest";

describe("LoginForm", () => {
  it("renders the form correctly", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText(/seu@email.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    const submitButton = buttons.find(button => button.textContent?.includes("Entrar"));
    expect(submitButton).toBeInTheDocument();
  });

  it("calls onSubmit with correct data when valid", async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText(/seu@email.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "password123" },
    });

    // Submitting the form
    const form = screen.getByPlaceholderText(/seu@email.com/i).closest("form");
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("displays error message when onSubmit throws an Error", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Invalid credentials"));
    render(<LoginForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText(/seu@email.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "password123" },
    });

    const form = screen.getByPlaceholderText(/seu@email.com/i).closest("form");
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("displays error message when onSubmit throws an object with message", async () => {
    const onSubmit = vi.fn().mockRejectedValue({ message: "Custom error message" });
    render(<LoginForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText(/seu@email.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "password123" },
    });

    const form = screen.getByPlaceholderText(/seu@email.com/i).closest("form");
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText("Custom error message")).toBeInTheDocument();
    });
  });

  it("displays default error message when onSubmit throws unknown error without message", async () => {
    const onSubmit = vi.fn().mockRejectedValue("Some string error");
    render(<LoginForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText(/seu@email.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "password123" },
    });

    const form = screen.getByPlaceholderText(/seu@email.com/i).closest("form");
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText("Erro ao fazer login. Tente novamente.")).toBeInTheDocument();
    });
  });

  it("displays default error message when onSubmit throws error with empty message", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error(""));
    render(<LoginForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText(/seu@email.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "password123" },
    });

    const form = screen.getByPlaceholderText(/seu@email.com/i).closest("form");
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText("Erro ao fazer login. Tente novamente.")).toBeInTheDocument();
    });
  });
});
