import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginForm from "@/components/auth/LoginForm";

describe("LoginForm", () => {
  it("renders login form correctly", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText("seu@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    render(<LoginForm />);
    const submitButton = screen.getByRole("button", { name: "Entrar" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("E-mail é obrigatório")).toBeInTheDocument();
      expect(screen.getByText("Senha é obrigatória")).toBeInTheDocument();
    });
  });

  it("calls onSubmit with correct data", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    render(<LoginForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••"), {
      target: { value: "password123" },
    });

    const submitButton = screen.getByRole("button", { name: "Entrar" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });
});
