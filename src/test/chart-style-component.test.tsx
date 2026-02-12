import React from "react";
import { render } from "@testing-library/react";
import { expect, test, describe } from "vitest";
import { ChartStyle } from "@/components/ui/chart";

const mockConfig = {
  sales: {
    color: "red",
  },
  revenue: {
    theme: {
      light: "blue",
      dark: "navy",
    },
  },
};

describe("ChartStyle", () => {
  test("renders style tag with correct CSS variables", () => {
    // @ts-expect-error - simulating mock config matching Partial<ChartConfig>
    const { container } = render(<ChartStyle id="test-chart" config={mockConfig} />);
    const style = container.querySelector("style");

    expect(style).not.toBeNull();

    const css = style?.textContent;

    // Check for light mode sales color
    // We expect quoted attribute value now
    expect(css).toContain("[data-chart='test-chart']");
    expect(css).toContain("--color-sales: red;");

    // Check for light mode revenue color
    expect(css).toContain("--color-revenue: blue;");

    // Check for dark mode
    expect(css).toContain(".dark [data-chart='test-chart']");
    expect(css).toContain("--color-revenue: navy;");
  });

  test("renders nothing if no color config", () => {
    const emptyConfig = {
      label: {
        label: "Label Only",
      },
    };
    // @ts-expect-error - simulating partial config
    const { container } = render(<ChartStyle id="test-chart" config={emptyConfig} />);
    const style = container.querySelector("style");
    expect(style).toBeNull();
  });
});
