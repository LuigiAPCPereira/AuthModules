import { describe, it, expect } from "vitest";
import { isPasswordStrong } from "../lib/utils";

describe("Password Strength Validation", () => {
  it("should return false for passwords shorter than 8 characters", () => {
    expect(isPasswordStrong("Short1!")).toBe(false);
  });

  it("should return false for passwords without uppercase letters", () => {
    expect(isPasswordStrong("nocaps1!")).toBe(false);
  });

  it("should return false for passwords without lowercase letters", () => {
    expect(isPasswordStrong("NOLOWER1!")).toBe(false);
  });

  it("should return false for passwords without numbers", () => {
    expect(isPasswordStrong("NoNumber!")).toBe(false);
  });

  it("should return false for passwords without special characters", () => {
    expect(isPasswordStrong("NoSpecial1")).toBe(false);
  });

  it("should return true for strong passwords", () => {
    expect(isPasswordStrong("ValidPass1!")).toBe(true);
    expect(isPasswordStrong("AnotherValid1@")).toBe(true);
  });
});
