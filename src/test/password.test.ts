import { describe, it, expect } from "vitest";
import { isStrongPassword } from "@/lib/utils";

describe("isStrongPassword", () => {
  it("should return false for passwords shorter than 8 characters", () => {
    expect(isStrongPassword("Ab1!")).toBe(false);
  });

  it("should return false for passwords without uppercase letters", () => {
    expect(isStrongPassword("testpass1!")).toBe(false);
  });

  it("should return false for passwords without lowercase letters", () => {
    expect(isStrongPassword("TESTPASS1!")).toBe(false);
  });

  it("should return false for passwords without numbers", () => {
    expect(isStrongPassword("TestPass!")).toBe(false);
  });

  it("should return false for passwords without special characters", () => {
    expect(isStrongPassword("TestPass123")).toBe(false);
  });

  it("should return true for strong passwords", () => {
    expect(isStrongPassword("TestPass1!")).toBe(true);
    expect(isStrongPassword("OtherTest1@")).toBe(true);
  });

  it("should handle edge cases", () => {
    expect(isStrongPassword("")).toBe(false);
    expect(isStrongPassword(" ")).toBe(false);
    // 8 chars exact
    expect(isStrongPassword("Test123!")).toBe(true);
  });
});
