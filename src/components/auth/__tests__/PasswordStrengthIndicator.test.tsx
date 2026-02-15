import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import PasswordStrengthIndicator from "@/components/auth/PasswordStrengthIndicator";
import { I18nProvider } from "@/contexts/I18nContext";
import { defaultLabelsPt } from "@/lib/i18n/labels";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nProvider labels={defaultLabelsPt} locale="pt">
    {children}
  </I18nProvider>
);

const TestComponent = () => {
  const { control, register } = useForm({
    defaultValues: {
      password: "",
    },
  });

  return (
    <Wrapper>
      <input type="password" data-testid="password-input" {...register("password")} />
      <PasswordStrengthIndicator control={control} />
    </Wrapper>
  );
};

describe("PasswordStrengthIndicator", () => {
  it("renders nothing initially", () => {
    render(<TestComponent />);
    // PasswordStrengthBar returns null if password is empty
    const progress = screen.queryByRole("progressbar");
    expect(progress).not.toBeInTheDocument();
  });

  it("updates when password changes", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    const input = screen.getByTestId("password-input");
    await user.type(input, "password");

    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });
});
