import { describe, it, expect } from "vitest";
import { isValidEmail } from "../lib/utils";

describe("isValidEmail", () => {
  it("should return true for valid emails", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user.name@domain.co")).toBe(true);
    expect(isValidEmail("user+tag@domain.com")).toBe(true);
    expect(isValidEmail("123@domain.com")).toBe(true);
  });

  it("should return false for invalid emails", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("test")).toBe(false);
    expect(isValidEmail("test@")).toBe(false);
    expect(isValidEmail("@domain.com")).toBe(false);
    expect(isValidEmail("test@domain")).toBe(false); // Depends on implementation, but strictly speaking emails should have TLD
    expect(isValidEmail("test@domain.")).toBe(false);
    expect(isValidEmail("test@.com")).toBe(false);
    expect(isValidEmail("test@domain..com")).toBe(false);
    expect(isValidEmail("test @domain.com")).toBe(false);
  });
});
