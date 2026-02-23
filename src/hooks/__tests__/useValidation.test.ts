import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useValidation } from "../useValidation";

describe("useValidation", () => {
  it("should initialize with no errors", () => {
    const { result } = renderHook(() =>
      useValidation({
        rules: [
          {
            field: "email",
            validate: (value) => value.includes("@") || "Invalid email",
            error: "Invalid email",
          },
        ],
      })
    );

    expect(result.current.errors).toEqual({});
  });

  it("should validate field on blur and set error", () => {
    const { result } = renderHook(() =>
      useValidation({
        rules: [
          {
            field: "email",
            validate: (value) => value.includes("@") || "Invalid email",
            error: "Invalid email",
          },
        ],
      })
    );

    act(() => {
      // New API: validateField(field, value)
      result.current.validateField("email", "invalid-email");
    });

    expect(result.current.errors).toEqual({ email: "Invalid email" });
  });

  it("should clear error when validation passes", () => {
    const { result } = renderHook(() =>
      useValidation({
        rules: [
          {
            field: "email",
            validate: (value) => value.includes("@") || "Invalid email",
            error: "Invalid email",
          },
        ],
      })
    );

    // Set error first
    act(() => {
      result.current.validateField("email", "invalid");
    });
    expect(result.current.errors).toEqual({ email: "Invalid email" });

    // Validate with correct value
    act(() => {
      result.current.validateField("email", "test@example.com");
    });

    expect(result.current.errors).toEqual({});
  });

  it("should explicitly clear error", () => {
    // To test clearError, we need to set an error first.
    const { result } = renderHook(() =>
      useValidation({
        rules: [
          {
            field: "test",
            validate: () => "error",
            error: "error",
          },
        ],
      })
    );

    act(() => {
        result.current.validateField("test", "");
    });
    expect(result.current.errors).toEqual({ test: "error" });

    act(() => {
      result.current.clearError("test");
    });

    expect(result.current.errors).toEqual({});
  });
});
