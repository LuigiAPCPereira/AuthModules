import { describe, it, expect } from "vitest";
import { getErrorMessage } from "@/lib/utils";

describe("getErrorMessage", () => {
  it("should return the message from an Error object", () => {
    const error = new Error("Test error");
    expect(getErrorMessage(error)).toBe("Test error");
  });

  it("should return the string if the error is a string", () => {
    expect(getErrorMessage("Something went wrong")).toBe("Something went wrong");
  });

  it("should return the message property if the error is an object with a message string", () => {
    const error = { message: "Custom error message" };
    expect(getErrorMessage(error)).toBe("Custom error message");
  });

  it("should return undefined if the message property is not a string", () => {
    const error = { message: 123 };
    expect(getErrorMessage(error)).toBeUndefined();
  });

  it("should return undefined if the error is null", () => {
    expect(getErrorMessage(null)).toBeUndefined();
  });

  it("should return undefined if the error is undefined", () => {
    expect(getErrorMessage(undefined)).toBeUndefined();
  });

  it("should return undefined if the error is an empty object", () => {
    expect(getErrorMessage({})).toBeUndefined();
  });

  it("should return undefined if the error is a number", () => {
    expect(getErrorMessage(123)).toBeUndefined();
  });
});
