
import { describe, it, expect } from "vitest";
import { loginSchema, signupSchema } from "./auth";

describe("Auth Schemas Security", () => {
  it("should reject extremely long emails (DoS prevention)", () => {
    const longEmail = "a".repeat(10000) + "@example.com";
    const result = loginSchema.safeParse({ email: longEmail, password: "Password123!" });
    // It currently passes, which is bad. We want it to fail.
    // If it fails (is valid), then we have found the vulnerability.
    // We expect valid input to pass, but overly long input should be rejected.
    // But currently there is NO max limit, so it might pass (valid email format) or fail (email regex mismatch).
    // Actually, email regex handles long strings but it might be slow.
    // However, length validation is missing.
    // So if the test expects rejection, it will fail (because currently it accepts).
    expect(result.success).toBe(false);
  });

  it("should reject extremely long passwords (ReDoS prevention)", () => {
    const longPassword = "A" + "a".repeat(10000) + "1!";
    const result = signupSchema.safeParse({
      name: "Test",
      email: "test@example.com",
      password: longPassword
    });
    // Currently passes (matches regexes and min length).
    expect(result.success).toBe(false);
  });
});
