import { describe, it, expect } from "vitest";
import { isPasswordStrong } from "../lib/utils";

describe("Password Strength Validation", () => {
  it("should return false for passwords shorter than 8 characters", () => {
    expect(isPasswordStrong("Ab1!")).toBe(false);
  });

  it("should return false for passwords without uppercase letters", () => {
    expect(isPasswordStrong("abcdef1!")).toBe(false);
  });

  it("should return false for passwords without lowercase letters", () => {
    expect(isPasswordStrong("ABCDEF1!")).toBe(false);
  });

  it("should return false for passwords without numbers", () => {
    expect(isPasswordStrong("Abcdefgh!")).toBe(false);
  });

  it("should return false for passwords without special characters", () => {
    expect(isPasswordStrong("Abcdefgh1")).toBe(false);
  });

  it("should return true for strong passwords", () => {
    expect(isPasswordStrong("Abcdefgh1!")).toBe(true);
    expect(isPasswordStrong("StrongP@ssw0rd")).toBe(true);
  });
});
