import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

describe("useIsMobile", () => {
  let innerWidthGetterSpy: ReturnType<typeof vi.fn>;
  let matchMediaMock: ReturnType<typeof vi.fn>;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  let listeners: Record<string, Function[]> = {};

  beforeEach(() => {
    listeners = {};
    // Mock window.matchMedia
    matchMediaMock = vi.fn().mockImplementation((query) => {
      return {
        matches: false, // default, will be overridden or used
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn((event, callback) => {
            if (!listeners[event]) listeners[event] = [];
            listeners[event].push(callback);
        }),
        removeEventListener: vi.fn((event, callback) => {
            if (listeners[event]) {
                listeners[event] = listeners[event].filter(cb => cb !== callback);
            }
        }),
        dispatchEvent: vi.fn(),
      };
    });
    window.matchMedia = matchMediaMock;

    // Spy on window.innerWidth
    // We define a getter so we can count accesses
    let _innerWidth = 1024;
    innerWidthGetterSpy = vi.fn(() => _innerWidth);
    Object.defineProperty(window, "innerWidth", {
      get: innerWidthGetterSpy,
      set: (v) => { _innerWidth = v; },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize correctly and update on change", () => {
    // Set initial width to be desktop
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).innerWidth = 1024;

    // We also need matchMedia to return consistent result
    matchMediaMock.mockImplementation((query) => ({
        matches: false, // 1024 > 768, so not mobile
        media: query,
        addEventListener: vi.fn((event, callback) => {
            if (!listeners[event]) listeners[event] = [];
            listeners[event].push(callback);
        }),
        removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());

    // Initial render returns undefined, then useEffect runs and sets false
    // Wait, useIsMobile returns !!isMobile.
    // undefined -> false.
    // false -> false.
    // So initially it should be false.

    expect(result.current).toBe(false);

    // Check innerWidth access count
    // The optimized implementation uses matchMedia and should NOT access innerWidth
    const initialCallCount = innerWidthGetterSpy.mock.calls.length;
    console.log("Initial innerWidth accesses:", initialCallCount);
    expect(initialCallCount).toBe(0);

    // Simulate resize to mobile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).innerWidth = 500;

    // Trigger change event
    // The event should have matches: true because 500 < 768
    const changeEvent = { matches: true, media: "(max-width: 767px)" } as MediaQueryListEvent;

    // Update the mql mock to have matches: true as well, since the implementation might read it
    const mql = matchMediaMock.mock.results[0].value;
    mql.matches = true;

    act(() => {
        if (listeners['change']) {
            listeners['change'].forEach(cb => cb(changeEvent));
        }
    });

    expect(result.current).toBe(true);

    // Check innerWidth access count again
    const finalCallCount = innerWidthGetterSpy.mock.calls.length;
    console.log("Final innerWidth accesses:", finalCallCount);

    // In optimized implementation, it should NOT access innerWidth
    expect(finalCallCount).toBe(0);
  });
});
