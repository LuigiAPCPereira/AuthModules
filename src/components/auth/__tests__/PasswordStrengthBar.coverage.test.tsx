import { render, screen, cleanup } from "@testing-library/react";
import PasswordStrengthBar from "../PasswordStrengthBar";
import { describe, it, expect, afterEach } from "vitest";

describe("PasswordStrengthBar Coverage", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows correct strength for only number", () => {
    render(<PasswordStrengthBar password="1" />);
    expect(screen.getByLabelText("Força da senha: Muito fraca, 1 de 5 requisitos atendidos")).toBeInTheDocument();
  });

  it("shows correct strength for only special char", () => {
    render(<PasswordStrengthBar password="!" />);
    expect(screen.getByLabelText("Força da senha: Muito fraca, 1 de 5 requisitos atendidos")).toBeInTheDocument();
  });

  it("shows correct strength for only uppercase", () => {
    render(<PasswordStrengthBar password="A" />);
    expect(screen.getByLabelText("Força da senha: Muito fraca, 1 de 5 requisitos atendidos")).toBeInTheDocument();
  });

  it("shows correct strength for only lowercase", () => {
    render(<PasswordStrengthBar password="a" />);
    expect(screen.getByLabelText("Força da senha: Muito fraca, 1 de 5 requisitos atendidos")).toBeInTheDocument();
  });

  it("shows correct strength for only length", () => {
    render(<PasswordStrengthBar password="abcdefgh" />);
    // Lower + Length. Score 2.
    expect(screen.getByLabelText("Força da senha: Fraca, 2 de 5 requisitos atendidos")).toBeInTheDocument();
  });

  it("shows correct strength for max score", () => {
    render(<PasswordStrengthBar password="StrongPass1!" />);
    expect(screen.getByLabelText("Força da senha: Forte, 5 de 5 requisitos atendidos")).toBeInTheDocument();
  });

  it("handles empty password", () => {
    render(<PasswordStrengthBar password="" />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("handles score 3 (e.g. Length, Upper, Lower)", () => {
    render(<PasswordStrengthBar password="Abcdefgh" />);
    expect(screen.getByLabelText("Força da senha: Razoável, 3 de 5 requisitos atendidos")).toBeInTheDocument();
  });

  it("handles score 4 (e.g. Length, Upper, Lower, Number)", () => {
    render(<PasswordStrengthBar password="Abcdefgh1" />);
    expect(screen.getByLabelText("Força da senha: Boa, 4 de 5 requisitos atendidos")).toBeInTheDocument();
  });
});
