import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SkipLink from "../SkipLink";

describe("SkipLink", () => {
  it("renders with correct href", () => {
    render(<SkipLink href="#main" />);
    const link = screen.getByText("Pular para o conteúdo").closest("a");
    expect(link).toHaveAttribute("href", "#main");
  });

  it("applies custom class names", () => {
    render(<SkipLink href="#main" className="custom-class" />);
    const link = screen.getByText("Pular para o conteúdo").closest("a");
    expect(link).toHaveClass("custom-class");
  });
});
