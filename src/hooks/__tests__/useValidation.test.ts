import { describe, it, expect, vi } from "vitest";
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
      // Fix: call validateField with value argument
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
    const { result: res } = renderHook(() =>
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
        res.current.validateField("test", "");
    });
    expect(res.current.errors).toEqual({ test: "error" });

    act(() => {
      res.current.clearError("test");
    });

    expect(res.current.errors).toEqual({});
  });
});
