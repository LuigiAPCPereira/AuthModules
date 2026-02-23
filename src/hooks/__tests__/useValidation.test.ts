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

    const mockEvent = {
      target: { value: "invalid-email" },
    } as React.FocusEvent<HTMLInputElement>;

    act(() => {
      result.current.validateField("email")(mockEvent);
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
    const invalidEvent = {
      target: { value: "invalid" },
    } as React.FocusEvent<HTMLInputElement>;

    act(() => {
      result.current.validateField("email")(invalidEvent);
    });
    expect(result.current.errors).toEqual({ email: "Invalid email" });

    // Validate with correct value
    const validEvent = {
      target: { value: "test@example.com" },
    } as React.FocusEvent<HTMLInputElement>;

    act(() => {
      result.current.validateField("email")(validEvent);
    });

    expect(result.current.errors).toEqual({});
  });

  it("should explicitly clear error", () => {
    const { result } = renderHook(() =>
      useValidation({
        rules: [],
      })
    );

    // Manually set error state (simulating previous validation)
    // Since we can't easily set state directly, we'll rely on the fact that clearError works
    // But to test it properly without validation, we might need a rule that fails first.

    // Let's reuse the validation flow
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

    const event = { target: { value: "" } } as React.FocusEvent<HTMLInputElement>;
    act(() => {
        res.current.validateField("test")(event);
    });
    expect(res.current.errors).toEqual({ test: "error" });

    act(() => {
      res.current.clearError("test");
    });

    expect(res.current.errors).toEqual({});
  });
});
