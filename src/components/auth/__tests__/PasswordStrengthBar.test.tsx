import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PasswordStrengthBar from "../PasswordStrengthBar";
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
      <PasswordStrengthBar password="TestPassword123!" />
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
      <PasswordStrengthBar password="TestPassword123!" />
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
});
