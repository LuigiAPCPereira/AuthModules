import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/components/auth/LoginForm";
import { I18nProvider } from "@/contexts/I18nContext";
import { defaultLabelsPt } from "@/lib/i18n/labels";

// Wrapper para providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <I18nProvider labels={defaultLabelsPt} locale="pt">
      {ui}
    </I18nProvider>
  );
};

describe("LoginForm", () => {
  it("renderiza corretamente com labels em português", () => {
    renderWithProviders(
      <LoginForm onSubmit={vi.fn()} />
    );
    
    expect(screen.getAllByText("Entrar")[0]).toBeInTheDocument();
    expect(screen.getByText("Bem-vindo de volta. Faça login na sua conta.")).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Senha/i)).toBeInTheDocument();
  });

  it("valida campos obrigatórios", async () => {
    renderWithProviders(
      <LoginForm onSubmit={vi.fn()} />
    );
    
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText("E-mail é obrigatório")).toBeInTheDocument();
      expect(screen.getByText("Senha é obrigatória")).toBeInTheDocument();
    });
  });

  it("valida formato de e-mail", async () => {
    renderWithProviders(
      <LoginForm onSubmit={vi.fn()} />
    );
    
    const emailInput = screen.getByLabelText(/E-mail/i);
    await userEvent.type(emailInput, "email-invalido");
    
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
    });
  });

  it("chama onSubmit com dados válidos", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(
      <LoginForm onSubmit={onSubmit} />
    );
    
    const emailInput = screen.getByLabelText(/E-mail/i);
    const passwordInput = screen.getByLabelText(/^Senha/i);
    
    await userEvent.type(emailInput, "teste@email.com");
    await userEvent.type(passwordInput, "Senha123!");
    
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: "teste@email.com",
        password: "Senha123!",
      });
    });
  });

  it("exibe mensagem de erro do servidor", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Credenciais inválidas"));
    renderWithProviders(
      <LoginForm onSubmit={onSubmit} />
    );
    
    const emailInput = screen.getByLabelText(/E-mail/i);
    const passwordInput = screen.getByLabelText(/^Senha/i);
    
    await userEvent.type(emailInput, "teste@email.com");
    await userEvent.type(passwordInput, "Senha123!");
    
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("desabilita botão durante submissão", async () => {
    const onSubmit = vi.fn().mockImplementation(() => new Promise(() => {}));
    renderWithProviders(
      <LoginForm onSubmit={onSubmit} />
    );
    
    const emailInput = screen.getByLabelText(/E-mail/i);
    const passwordInput = screen.getByLabelText(/^Senha/i);
    
    await userEvent.type(emailInput, "teste@email.com");
    await userEvent.type(passwordInput, "Senha123!");
    
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveAttribute("aria-busy", "true");
    });
  });
});
