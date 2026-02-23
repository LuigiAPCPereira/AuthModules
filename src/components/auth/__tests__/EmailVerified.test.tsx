import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EmailVerified from "../EmailVerified";
import { I18nProvider } from "@/contexts/I18nContext";
import { defaultLabelsPt } from "@/lib/i18n/labels";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <I18nProvider labels={defaultLabelsPt} locale="pt">
      {ui}
    </I18nProvider>
  );
};

describe("EmailVerified", () => {
  it("renders success message", () => {
    renderWithProviders(<EmailVerified />);
    expect(screen.getByText("E-mail verificado!")).toBeInTheDocument();
    expect(screen.getByText(/sua conta foi verificada/i)).toBeInTheDocument();
  });

  it("calls onContinue when button clicked", () => {
    const onContinue = vi.fn();
    renderWithProviders(<EmailVerified onContinue={onContinue} />);

    const button = screen.getByRole("button", { name: "Continuar" });
    fireEvent.click(button);

    expect(onContinue).toHaveBeenCalled();
  });
});
