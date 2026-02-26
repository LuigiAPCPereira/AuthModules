import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import PasswordStrengthIndicator from "../PasswordStrengthIndicator";
import userEvent from "@testing-library/user-event";
import React from "react";

const Wrapper = () => {
  const { control, register } = useForm({
    defaultValues: {
      password: "",
    }
  });
  return (
    <>
      <label htmlFor="password">Senha</label>
      <input id="password" type="password" {...register("password")} />
      <PasswordStrengthIndicator control={control} />
    </>
  );
};

describe("PasswordStrengthIndicator", () => {
  it("renders nothing initially (empty password)", () => {
    render(<Wrapper />);
    expect(screen.queryByText("Mínimo 8 caracteres")).not.toBeInTheDocument();
  });

  it("renders strength indicator when typing", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);

    const input = screen.getByLabelText("Senha");
    await user.type(input, "Weak");

    expect(screen.getByText("Mínimo 8 caracteres")).toBeInTheDocument();

    // Check if it updates to Strong
    // "StrongPass1!" satisfies all requirements
    await user.clear(input);
    await user.type(input, "StrongPass1!");

    // Wait for update (useWatch handles it, usually instant in tests but await findBy might be safer)
    expect(await screen.findByText("Forte")).toBeInTheDocument();
  });
});
