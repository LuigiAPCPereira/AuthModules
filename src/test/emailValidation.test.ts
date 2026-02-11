import { describe, it, expect } from "vitest";
import { isValidEmail } from "../lib/utils";
import { EMAIL_REGEX } from "../lib/constants";

describe("Email Validation", () => {
  const validEmails = [
    "test@example.com",
    "user.name@example.co.uk",
    "user+tag@example.com",
    "a@b.c",
    "123@456.789",
  ];

  const invalidEmails = [
    "plainaddress",
    "@example.com",
    "user@",
    "user@example",
    "user.name@example.",
    "user name@example.com",
    "user@exa mple.com",
    "",
    "   ",
  ];

  describe("isValidEmail (current implementation)", () => {
    validEmails.forEach((email) => {
      it(`should validate ${email}`, () => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    invalidEmails.forEach((email) => {
      it(`should invalidate ${email}`, () => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  describe("EMAIL_REGEX (shared constant)", () => {
    validEmails.forEach((email) => {
      it(`should match ${email}`, () => {
        expect(EMAIL_REGEX.test(email)).toBe(true);
      });
    });

    invalidEmails.forEach((email) => {
      it(`should not match ${email}`, () => {
        expect(EMAIL_REGEX.test(email)).toBe(false);
      });
    });
  });
});
