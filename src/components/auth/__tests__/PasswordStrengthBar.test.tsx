import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PasswordStrengthBar from "@/components/auth/PasswordStrengthBar";
import { I18nProvider } from "@/contexts/I18nContext";
import { defaultLabelsPt } from "@/lib/i18n/labels";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <I18nProvider labels={defaultLabelsPt} locale="pt">
      {ui}
    </I18nProvider>
  );
};

describe("PasswordStrengthBar", () => {
  it("não renderiza quando senha está vazia", () => {
    const { container } = renderWithProviders(
      <PasswordStrengthBar password="" />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it("renderiza quando senha tem conteúdo", () => {
    renderWithProviders(
      <PasswordStrengthBar password="senha" />
    );
    
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("tem atributos ARIA corretos para acessibilidade", () => {
    renderWithProviders(
      <PasswordStrengthBar password="TestPassword123!" /> // ggignore
    );
    
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "5");
    expect(progressbar).toHaveAttribute("aria-label");
  });

  it("mostra força 'Muito fraca' para senha curta", () => {
    renderWithProviders(
      <PasswordStrengthBar password="abc" />
    );
    
    expect(screen.getByText("Muito fraca")).toBeInTheDocument();
  });

  it("mostra força 'Forte' para senha completa", () => {
    renderWithProviders(
      <PasswordStrengthBar password="TestPassword123!" /> // ggignore
    );
    
    expect(screen.getByText("Forte")).toBeInTheDocument();
  });

  it("mostra lista de requisitos", () => {
    renderWithProviders(
      <PasswordStrengthBar password="senha" />
    );
    
    expect(screen.getByText("Mínimo 8 caracteres")).toBeInTheDocument();
    expect(screen.getByText("Letra maiúscula")).toBeInTheDocument();
    expect(screen.getByText("Letra minúscula")).toBeInTheDocument();
    expect(screen.getByText("Número")).toBeInTheDocument();
    expect(screen.getByText("Caractere especial")).toBeInTheDocument();
  });

  it("renderiza requisitos como itens de lista acessíveis", () => {
    renderWithProviders(<PasswordStrengthBar password="senha" />);

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(5);
  });

  it("tem texto acessível indicando status dos requisitos", () => {
    renderWithProviders(<PasswordStrengthBar password="Senha" />);

    // "Senha" -> Uppercase: met, Lowercase: met. Length: unmet. Number: unmet. Special: unmet.

    const items = screen.getAllByRole("listitem");

    // Find specific items and check their full text content including hidden text
    const uppercaseItem = items.find(item => item.textContent?.includes("Letra maiúscula"));
    expect(uppercaseItem).toHaveTextContent("Letra maiúscula - atendido");

    const lengthItem = items.find(item => item.textContent?.includes("Mínimo 8 caracteres"));
    expect(lengthItem).toHaveTextContent("Mínimo 8 caracteres - pendente");
  });
});
