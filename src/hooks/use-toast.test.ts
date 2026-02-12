import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { reducer, toast } from "./use-toast";

describe("use-toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("reducer should NOT trigger side effect (setTimeout) on DISMISS_TOAST anymore", () => {
    const id = "test-id-" + Math.random().toString();
    const state = { toasts: [{ id, title: "Test", open: true }] };
    const action = { type: "DISMISS_TOAST", toastId: id } as any;

    const spy = vi.spyOn(global, "setTimeout");

    // This call should NOT trigger the side effect because it's removed from reducer
    reducer(state, action);

    expect(spy).not.toHaveBeenCalled();
  });

  it("toast function should trigger side effect when dismissed (via dispatch)", () => {
    const spy = vi.spyOn(global, "setTimeout");

    const { dismiss } = toast({ title: "Test Toast" });
    dismiss();

    expect(spy).toHaveBeenCalled();
  });
});
