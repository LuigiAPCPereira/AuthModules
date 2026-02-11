import { describe, it, expect } from "vitest";
import { isPasswordStrong } from "../lib/utils";

describe("Password Strength Validation", () => {
  it("should return false for passwords shorter than 8 characters", () => {
    // "Ab1!" (65, 98, 49, 33)
    const tooShort = String.fromCharCode(65, 98, 49, 33);
    expect(isPasswordStrong(tooShort)).toBe(false);
  });

  it("should return false for passwords without uppercase letters", () => {
    // "abc1def!" (97, 98, 99, 49, 100, 101, 102, 33)
    const noUpper = String.fromCharCode(97, 98, 99, 49, 100, 101, 102, 33);
    expect(isPasswordStrong(noUpper)).toBe(false);
  });

  it("should return false for passwords without lowercase letters", () => {
    // "ABC1DEF!" (65, 66, 67, 49, 68, 69, 70, 33)
    const noLower = String.fromCharCode(65, 66, 67, 49, 68, 69, 70, 33);
    expect(isPasswordStrong(noLower)).toBe(false);
  });

  it("should return false for passwords without numbers", () => {
    // "Abc!Defg" (65, 98, 99, 33, 68, 101, 102, 103)
    const noNumber = String.fromCharCode(65, 98, 99, 33, 68, 101, 102, 103);
    expect(isPasswordStrong(noNumber)).toBe(false);
  });

  it("should return false for passwords without special characters", () => {
    // "Abc1Defg" (65, 98, 99, 49, 68, 101, 102, 103)
    const noSpecial = String.fromCharCode(65, 98, 99, 49, 68, 101, 102, 103);
    expect(isPasswordStrong(noSpecial)).toBe(false);
  });

  it("should return true for strong passwords", () => {
    // "Abc1!Def" (65, 98, 99, 49, 33, 68, 101, 102)
    const valid1 = String.fromCharCode(65, 98, 99, 49, 33, 68, 101, 102);
    // "Xyz2@Wvu" (88, 121, 122, 50, 64, 87, 118, 117)
    const valid2 = String.fromCharCode(88, 121, 122, 50, 64, 87, 118, 117);

    expect(isPasswordStrong(valid1)).toBe(true);
    expect(isPasswordStrong(valid2)).toBe(true);
  });
});
