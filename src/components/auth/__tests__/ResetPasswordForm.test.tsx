
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ResetPasswordForm from "../ResetPasswordForm";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Mock para evitar erros de importação de módulos não presentes no ambiente de teste
vi.mock("@/components/ui/toaster", () => ({
  Toaster: () => null,
}));

vi.mock("@/components/ui/tooltip", () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <TooltipProvider>
      {ui}
      <Toaster />
    </TooltipProvider>
  );
};

describe("ResetPasswordForm", () => {
  it("renders correctly", () => {
    renderWithProviders(<ResetPasswordForm />);
    expect(screen.getByRole("heading", { name: "Redefinir senha" })).toBeInTheDocument();
    // Fix: Use regex to match label text with asterisk or extra spaces
    expect(screen.getByLabelText(/Nova senha/i)).toBeInTheDocument();
  });

  it("validates password strength", async () => {
    renderWithProviders(<ResetPasswordForm />);

    // Fix: Use regex to locate input by label
    const passwordInput = screen.getByLabelText(/Nova senha/i);
    await userEvent.type(passwordInput, "weak");

    const submitButton = screen.getByRole("button", { name: "Redefinir senha" });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Mínimo 8 caracteres/i)).toBeInTheDocument();
    });
  });

  it("submits with valid password", async () => {
    const onSubmit = vi.fn();
    renderWithProviders(<ResetPasswordForm onSubmit={onSubmit} />);

    // Fix: Use regex to locate input by label
    const passwordInput = screen.getByLabelText(/Nova senha/i);
    await userEvent.type(passwordInput, "TestPassword123!"); // ggignore

    const submitButton = screen.getByRole("button", { name: "Redefinir senha" });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ password: "TestPassword123!" }); // ggignore
    });
  });
});
