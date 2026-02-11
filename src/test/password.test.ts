import { describe, it, expect } from "vitest";
import { isStrongPassword } from "@/lib/utils";

describe("isStrongPassword", () => {
  it("should return false for passwords shorter than 8 characters", () => {
    expect(isStrongPassword("Ab1!")).toBe(false);
  });

  it("should return false for passwords without uppercase letters", () => {
    expect(isStrongPassword("password123!")).toBe(false);
  });

  it("should return false for passwords without lowercase letters", () => {
    expect(isStrongPassword("PASSWORD123!")).toBe(false);
  });

  it("should return false for passwords without numbers", () => {
    expect(isStrongPassword("Password!")).toBe(false);
  });

  it("should return false for passwords without special characters", () => {
    expect(isStrongPassword("Password123")).toBe(false);
  });

  it("should return true for strong passwords", () => {
    expect(isStrongPassword("StrongP@ssw0rd")).toBe(true);
    expect(isStrongPassword("AnotherStrong1!")).toBe(true);
  });

  it("should handle edge cases", () => {
    expect(isStrongPassword("")).toBe(false);
    expect(isStrongPassword(" ")).toBe(false);
    // 8 chars exact
    expect(isStrongPassword("Abcd123!")).toBe(true);
  });
});
