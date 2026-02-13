import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupForm from "../SignupForm";
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

    expect(screen.getByRole("heading", { name: "Criar conta" })).toBeInTheDocument();
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
    fireEvent.change(passwordInput, { target: { value: "123" } }); // ggignore

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
    fireEvent.change(passwordInput, { target: { value: "TestPassword123!" } }); // ggignore

    // Verifica se o PasswordStrengthBar aparece
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("chama onSubmit com dados válidos", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(
      <SignupForm onSubmit={onSubmit} />
    );

    fireEvent.change(screen.getByLabelText("Nome completo"), { target: { value: "João Silva" } });
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "joao@email.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "TestPassword123!" } }); // ggignore

    const submitButton = screen.getByRole("button", { name: /criar conta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "João Silva",
        email: "joao@email.com",
        password: "TestPassword123!", // ggignore
      });
    });
  });
});
