import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SkipLink from "../SkipLink";

describe("SkipLink", () => {
  it("renders correctly with default props", () => {
    render(<SkipLink href="#main-content" />);
    const link = screen.getByRole("link", { name: /pular para o conteúdo/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#main-content");
    // Check for sr-only class which hides it visually by default
    expect(link).toHaveClass("sr-only");
  });

  it("has correct focus classes to become visible", () => {
    render(<SkipLink href="#content" />);
    const link = screen.getByRole("link", { name: /pular para o conteúdo/i });

    // Check for focus classes that ensure visibility when focused
    expect(link).toHaveClass("focus:not-sr-only");
    expect(link).toHaveClass("focus:fixed");
    expect(link).toHaveClass("focus:z-50");
  });

  it("merges custom classes correctly", () => {
    render(<SkipLink href="#content" className="custom-class" />);
    const link = screen.getByRole("link", { name: /pular para o conteúdo/i });
    expect(link).toHaveClass("custom-class");
    expect(link).toHaveClass("sr-only");
  });
});
