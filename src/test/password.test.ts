import { describe, it, expect } from "vitest";
import { isPasswordStrong } from "../lib/utils";

describe("Password Strength Validation", () => {
  it("should return false for passwords shorter than 8 characters", () => {
    expect(isPasswordStrong("Ab1!")).toBe(false);
  });

  it("should return false for passwords without uppercase letters", () => {
    expect(isPasswordStrong("abc1def!")).toBe(false);
  });

  it("should return false for passwords without lowercase letters", () => {
    expect(isPasswordStrong("ABC1DEF!")).toBe(false);
  });

  it("should return false for passwords without numbers", () => {
    expect(isPasswordStrong("Abc!Defg")).toBe(false);
  });

  it("should return false for passwords without special characters", () => {
    expect(isPasswordStrong("Abc1Defg")).toBe(false);
  });

  it("should return true for strong passwords", () => {
    expect(isPasswordStrong("Abc1!Def")).toBe(true);
    expect(isPasswordStrong("Xyz2@Wvu")).toBe(true);
  });
});
