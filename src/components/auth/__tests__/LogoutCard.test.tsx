import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LogoutCard from "../LogoutCard";
import { I18nProvider } from "@/contexts/I18nContext";
import { AuthProvider } from "@/contexts/AuthContext"; // Added import for AuthProvider
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

describe("LogoutCard", () => {
  it("renders correctly with user info", () => {
    renderWithProviders(
      <LogoutCard userName="Test User" userEmail="test@example.com" />
    );
    expect(screen.getByText("Sair da conta")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("calls onLogout when confirmed", async () => {
    const onLogout = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(<LogoutCard onLogout={onLogout} />);

    const logoutButton = screen.getByRole("button", { name: "Sair" });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(onLogout).toHaveBeenCalled();
    });
  });

  it("calls onCancel when cancelled", () => {
    const onCancel = vi.fn();
    renderWithProviders(<LogoutCard onCancel={onCancel} />);

    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });
});
