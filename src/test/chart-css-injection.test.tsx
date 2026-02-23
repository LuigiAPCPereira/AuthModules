import React from "react";
import { render } from "@testing-library/react";
import { expect, test, describe } from "vitest";
import { ChartContainer } from "@/components/ui/chart";

const mockConfig = {
  sales: {
    color: "red",
  },
};

describe("ChartContainer Security", () => {
  test("prevents CSS injection via id prop", () => {
    const maliciousId = "test'] { body { display: none; } } [";
    // @ts-expect-error - mock children
    const { container } = render(
      <ChartContainer id={maliciousId} config={mockConfig}>
        <div />
      </ChartContainer>
    );

    const style = container.querySelector("style");
    expect(style).not.toBeNull();
    const css = style?.textContent;

    // The malicious CSS should NOT be valid or effectively matching the injection
    // With current vulnerable code, it would be: [data-chart='chart-test'] { body { display: none; } } [']
    // We want to ensure the sanitization prevents this.
    // So we expect the ID to be sanitized in the CSS selector.

    // If vulnerable:
    // css would contain: [data-chart='chart-test'] { body { display: none; } } [']

    // We assert that the dangerous characters are NOT present in the selector context
    expect(css).not.toContain("body { display: none; }");
  });
});
