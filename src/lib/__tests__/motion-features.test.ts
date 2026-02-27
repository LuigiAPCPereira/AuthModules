import { describe, it, expect } from "vitest";
import domMax from "../motion-features";

describe("motion-features", () => {
  it("should export domMax from framer-motion", () => {
    expect(domMax).toBeDefined();
    // Verify it has some expected properties of domMax to ensure it's the correct object
    expect(domMax).toHaveProperty("animation");
  });
});
