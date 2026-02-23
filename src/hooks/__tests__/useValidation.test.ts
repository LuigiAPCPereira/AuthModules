
import { renderHook, act } from "@testing-library/react";
import { useValidation } from "../useValidation";
import { describe, it, expect } from "vitest";

describe("useValidation", () => {
  const rules = [
    {
      field: "email",
      validate: (value: string) => value.includes("@") || "Invalid email",
      error: "Invalid email",
    },
  ];

  it("validates field correctly", () => {
    const { result } = renderHook(() => useValidation({ rules }));

    let isValid;
    act(() => {
      // Fix: Ensure the function is called within act() and capture result if needed
      // The previous error suggests an issue with argument passing or internal state
      isValid = result.current.validateField("email", "invalid");
    });

    expect(isValid).toBe(false);
    expect(result.current.errors.email).toBe("Invalid email");
  });

  it("clears error when valid", () => {
    const { result } = renderHook(() => useValidation({ rules }));

    act(() => {
      result.current.validateField("email", "invalid");
    });
    expect(result.current.errors.email).toBe("Invalid email");

    act(() => {
      result.current.validateField("email", "test@example.com"); // ggignore
    });
    expect(result.current.errors.email).toBeUndefined();
  });
});
