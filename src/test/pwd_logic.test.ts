import { describe, it, expect } from "vitest";
import { isStrongPassword } from "@/lib/utils";

describe("isStrongPassword", () => {
  it("should return false for strings shorter than 8 characters", () => {
    expect(isStrongPassword("Short1!")).toBe(false);
  });

  it("should return false for strings without uppercase letters", () => {
    expect(isStrongPassword("invalid_no_upper_1!")).toBe(false);
  });

  it("should return false for strings without lowercase letters", () => {
    expect(isStrongPassword("INVALID_NO_LOWER_1!")).toBe(false);
  });

  it("should return false for strings without numbers", () => {
    expect(isStrongPassword("Invalid_No_Num_!")).toBe(false);
  });

  it("should return false for strings without special characters", () => {
    expect(isStrongPassword("InvalidNoSpecial1")).toBe(false);
  });

  it("should return true for valid strong strings", () => {
    expect(isStrongPassword("Valid_String_1$")).toBe(true);
    expect(isStrongPassword("Another_Valid_2@")).toBe(true);
  });

  it("should handle edge cases", () => {
    expect(isStrongPassword("")).toBe(false);
    expect(isStrongPassword(" ")).toBe(false);
    // 8 chars exact
    expect(isStrongPassword("Valid_8!")).toBe(true);
  });
});
