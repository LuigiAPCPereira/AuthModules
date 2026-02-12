import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { reducer, toast, resetToastState, TOAST_REMOVE_DELAY, type Action } from "./use-toast";

describe("use-toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetToastState();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("reducer should NOT trigger side effect (setTimeout) on DISMISS_TOAST anymore", () => {
    const id = "test-id-" + Math.random().toString();
    const state = { toasts: [{ id, title: "Test", open: true }] };

    const action: Action = {
      type: "DISMISS_TOAST",
      toastId: id
    };

    const spy = vi.spyOn(global, "setTimeout");

    // This call should NOT trigger the side effect because it's removed from reducer
    reducer(state, action);

    expect(spy).not.toHaveBeenCalled();
  });

  it("toast function should trigger side effect when dismissed (via dispatch)", () => {
    const spy = vi.spyOn(global, "setTimeout");

    const { dismiss } = toast({ title: "Test Toast" });
    dismiss();

    expect(spy).toHaveBeenCalledWith(expect.any(Function), TOAST_REMOVE_DELAY);
  });
});
