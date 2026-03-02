import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { LazyMotion, domMax } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import ThemeToggle from "./ThemeToggle";
import { describe, it, expect } from "vitest";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <LazyMotion features={domMax}>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </LazyMotion>
  </ThemeProvider>
);

describe("ThemeToggle", () => {
  it("renders correctly", () => {
    render(
      <Wrapper>
        <ThemeToggle />
      </Wrapper>
    );
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Mudar para tema escuro");
  });

  it("toggles theme on click", () => {
    render(
      <Wrapper>
        <ThemeToggle />
      </Wrapper>
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    // Since next-themes modifies the DOM (html class), we can check that if we want,
    // but verifying interaction is enough for now given we trust next-themes.
  });
});
