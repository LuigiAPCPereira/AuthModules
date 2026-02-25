import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPasswordForm from "../ResetPasswordForm";
import { I18nProvider } from "@/contexts/I18nContext";
import { AuthProvider } from "@/contexts/AuthContext"; // Added AuthProvider import
import { defaultLabelsPt } from "@/lib/i18n/labels";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthProvider supabaseUrl="https://test-url.supabase.co" supabaseAnonKey="test-key">
      <I18nProvider labels={defaultLabelsPt} locale="pt">
        {ui}
      </I18nProvider>
    </AuthProvider>
  );
};

describe("ResetPasswordForm", () => {
  beforeAll(() => {
    window.scrollTo = vi.fn();
  });
  it("renders correctly", () => {
    renderWithProviders(<ResetPasswordForm />);
    expect(screen.getByRole("heading", { name: "Redefinir senha" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nova senha/i)).toBeInTheDocument();
  });

  it("validates password strength", async () => {
    renderWithProviders(<ResetPasswordForm />);

    const passwordInput = screen.getByLabelText(/Nova senha/i);
    await userEvent.type(passwordInput, "weak");

    const submitButton = screen.getByRole("button", { name: /redefinir senha/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/mínimo de 8 caracteres/i)).toBeInTheDocument();
    });
  });

  it("submits with valid password", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(<ResetPasswordForm onSubmit={onSubmit} />);

    const passwordInput = screen.getByLabelText(/Nova senha/i);
    await userEvent.type(passwordInput, "TestPassword123!"); // ggignore

    const submitButton = screen.getByRole("button", { name: /redefinir senha/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("TestPassword123!"); // ggignore
    });
  });
});
