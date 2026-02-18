import { describe, it, expect } from "vitest";
import { getAuthErrorMessage, AUTH_ERROR_MESSAGES } from "./errorMessages";

describe("getAuthErrorMessage", () => {
  it("SECURITY: prevents user enumeration by returning generic error for EMAIL_NOT_FOUND code", () => {
    // This test confirms that the system NO LONGER leaks whether an email exists
    const errorWithCode = { code: "EMAIL_NOT_FOUND" };
    expect(getAuthErrorMessage(errorWithCode)).toBe(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  it("SECURITY: prevents user enumeration by returning generic error for User Not Found string error", () => {
    const errorString = "User not found";
    expect(getAuthErrorMessage(errorString)).toBe(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  it("handles INVALID_CREDENTIALS correctly", () => {
    const errorWithCode = { code: "INVALID_CREDENTIALS" };
    expect(getAuthErrorMessage(errorWithCode)).toBe(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  it("SECURITY: handles conflicting strings by returning generic error to prevent user enumeration", () => {
    // When a message contains both "invalid" and "not found", return generic error
    // This prevents attackers from distinguishing between invalid email format vs non-existent user
    const conflictingError = "invalid user not found";
    expect(getAuthErrorMessage(conflictingError)).toBe(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
  });
});
