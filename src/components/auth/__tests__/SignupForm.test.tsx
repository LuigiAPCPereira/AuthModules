import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupForm from "@/components/auth/SignupForm";
import { I18nProvider } from "@/contexts/I18nContext";
import { defaultLabelsPt } from "@/lib/i18n/labels";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <I18nProvider labels={defaultLabelsPt} locale="pt">
      {ui}
    </I18nProvider>
  );
};

describe("SignupForm", () => {
  it("renderiza corretamente", () => {
    renderWithProviders(
      <SignupForm onSubmit={vi.fn()} />
    );
    
    expect(screen.getAllByText("Criar conta")[0]).toBeInTheDocument();
    expect(screen.getByLabelText("Nome completo")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
  });

  it("NÃO deve ter campo de confirmar senha (quick win)", () => {
    renderWithProviders(
      <SignupForm onSubmit={vi.fn()} />
    );
    
    // Verifica que não existe label "Confirmar senha"
    expect(screen.queryByLabelText(/confirmar/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/confirmar senha/i)).not.toBeInTheDocument();
  });

  it("valida força da senha", async () => {
    renderWithProviders(
      <SignupForm onSubmit={vi.fn()} />
    );
    
    const passwordInput = screen.getByLabelText("Senha");
    await userEvent.type(passwordInput, "123");
    
    const submitButton = screen.getByRole("button", { name: /criar conta/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/mínimo de 8 caracteres/i)).toBeInTheDocument();
    });
  });

  it("mostra indicador de força da senha", async () => {
    renderWithProviders(
      <SignupForm onSubmit={vi.fn()} />
    );
    
    const passwordInput = screen.getByLabelText("Senha");
    await userEvent.type(passwordInput, "SenhaForte123!");
    
    // Verifica se o PasswordStrengthBar aparece
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("associa corretamente o input de senha com os requisitos via aria-describedby", async () => {
    renderWithProviders(<SignupForm onSubmit={vi.fn()} />);

    const passwordInput = screen.getByLabelText("Senha");
    await userEvent.type(passwordInput, "a");

    const strengthMeter = screen.getByRole("list", { name: /requisitos/i });
    const meterId = strengthMeter.getAttribute("id");
    const describedBy = passwordInput.getAttribute("aria-describedby");

    expect(meterId).toBeTruthy();
    expect(describedBy).toContain(meterId);
  });

  it("chama onSubmit com dados válidos", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(
      <SignupForm onSubmit={onSubmit} />
    );
    
    await userEvent.type(screen.getByLabelText("Nome completo"), "João Silva");
    await userEvent.type(screen.getByLabelText("E-mail"), "joao@email.com");
    await userEvent.type(screen.getByLabelText("Senha"), "SenhaForte123!");
    
    const submitButton = screen.getByRole("button", { name: /criar conta/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "João Silva",
        email: "joao@email.com",
        password: "SenhaForte123!",
      });
    });
  });
});
