import { render, screen } from "@testing-library/react";
import PasswordStrengthBar from "../PasswordStrengthBar";
import { describe, it, expect } from "vitest";

describe("PasswordStrengthBar Coverage", () => {
  it("shows correct strength for various passwords", () => {
    // 1. Only Number
    render(<PasswordStrengthBar password="1" />);
    // "Número" rule should be met, others failed. Score 1.
    expect(screen.getByLabelText("Força da senha: Muito fraca, 1 de 5 requisitos atendidos")).toBeInTheDocument();

    // 2. Only Special
    render(<PasswordStrengthBar password="!" />);
    expect(screen.getByLabelText("Força da senha: Muito fraca, 1 de 5 requisitos atendidos")).toBeInTheDocument();

    // 3. Only Upper
    render(<PasswordStrengthBar password="A" />);
    expect(screen.getByLabelText("Força da senha: Muito fraca, 1 de 5 requisitos atendidos")).toBeInTheDocument();

    // 4. Only Lower
    render(<PasswordStrengthBar password="a" />);
    expect(screen.getByLabelText("Força da senha: Muito fraca, 1 de 5 requisitos atendidos")).toBeInTheDocument();

    // 5. Only Length (no number, no special, no upper, only lower? "abcdefgh")
    render(<PasswordStrengthBar password="abcdefgh" />);
    // Lower + Length. Score 2.
    expect(screen.getByLabelText("Força da senha: Fraca, 2 de 5 requisitos atendidos")).toBeInTheDocument();

    // 6. Max Score (5/5)
    render(<PasswordStrengthBar password="StrongPass1!" />);
    expect(screen.getByLabelText("Força da senha: Forte, 5 de 5 requisitos atendidos")).toBeInTheDocument();
  });

  it("handles empty password", () => {
    render(<PasswordStrengthBar password="" />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("handles score 3 (e.g. Length, Upper, Lower)", () => {
    render(<PasswordStrengthBar password="Abcdefgh" />);
    // Length=8, Upper=1, Lower=6, Num=0, Special=0.
    expect(screen.getByLabelText("Força da senha: Razoável, 3 de 5 requisitos atendidos")).toBeInTheDocument();
  });

  it("handles score 4 (e.g. Length, Upper, Lower, Number)", () => {
    render(<PasswordStrengthBar password="Abcdefgh1" />);
    // Length=9, Upper=1, Lower=6, Num=1, Special=0.
    expect(screen.getByLabelText("Força da senha: Boa, 4 de 5 requisitos atendidos")).toBeInTheDocument();
  });
});
