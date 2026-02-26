import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthInput from "../../../components/auth/AuthInput";
import React from "react";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
      p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props}>{children}</p>,
    },
  };
});

describe("AuthInput", () => {
  it("renders label and input", () => {
    render(<AuthInput label="Email" placeholder="Enter email" />);

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("associates label with input using htmlFor and id", () => {
    render(<AuthInput label="Test Label" id="test-input" />);

    // This verifies the label is correctly associated with the input
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    expect(screen.getByLabelText("Test Label")).toHaveAttribute("id", "test-input");
  });

  it("toggles password visibility", () => {
    render(<AuthInput label="Password" type="password" placeholder="Enter password" />);

    const input = screen.getByPlaceholderText("Enter password") as HTMLInputElement;
    expect(input.type).toBe("password");

    // Toggle to show password (click EyeOff - "Mostrar senha")
    const toggleButton = screen.getByLabelText("Mostrar senha");
    fireEvent.click(toggleButton);

    expect(input.type).toBe("text");

    // Toggle to hide password (click Eye - "Ocultar senha")
    const hideButton = screen.getByLabelText("Ocultar senha");
    fireEvent.click(hideButton);

    expect(input.type).toBe("password");
  });

  it("password toggle button is keyboard accessible", () => {
    render(<AuthInput label="Password" id="password-input" type="password" />);

    const toggleButton = screen.getByLabelText("Mostrar senha");
    expect(toggleButton).toBeInTheDocument();

    // Ensure the button is keyboard accessible (not tabIndex="-1")
    expect(toggleButton).not.toHaveAttribute("tabIndex", "-1");
  });

  it("does not show toggle button for non-password types", () => {
    render(<AuthInput label="Email" type="email" placeholder="Enter email" />);

    expect(screen.queryByLabelText("Mostrar senha")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Ocultar senha")).not.toBeInTheDocument();
  });

  it("displays error message", () => {
    const errorMessage = "Invalid email";
    // We pass an id for aria-describedby to work fully as intended in code, but checking text content is enough.
    render(<AuthInput label="Email" type="email" error={errorMessage} id="email-input" />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    // Check if error message has role="alert"
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(errorMessage);

    // Check input has aria-invalid
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("forwards ref to input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<AuthInput label="Email" type="text" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("shows Caps Lock warning when Caps Lock is active on password field", async () => {
    render(<AuthInput id="caps-password-input" label="Password" type="password" />);
    const input = screen.getByLabelText("Password");

    // Manually create event to properly mock getModifierState method
    const event = new KeyboardEvent("keydown", {
      key: "A",
      code: "KeyA",
      bubbles: true,
      cancelable: true,
    });

    // Mock getModifierState
    Object.defineProperty(event, "getModifierState", {
      value: (key: string) => key === "CapsLock",
    });

    fireEvent(input, event);

    await waitFor(() => {
      expect(screen.getByText("Caps Lock ativado")).toBeInTheDocument();
    });
  });

  it("does not show Caps Lock warning on non-password field", () => {
    render(<AuthInput id="caps-text-input" label="Text" type="text" />);
    const input = screen.getByLabelText("Text");

    const event = new KeyboardEvent("keydown", {
      key: "A",
      code: "KeyA",
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, "getModifierState", {
      value: (key: string) => key === "CapsLock",
    });

    fireEvent(input, event);

    expect(screen.queryByText("Caps Lock ativado")).not.toBeInTheDocument();
  });

  it("hides Caps Lock warning when Caps Lock is deactivated", async () => {
    render(<AuthInput id="caps-toggle-input" label="Password" type="password" />);
    const input = screen.getByLabelText("Password");

    // Activate
    const eventOn = new KeyboardEvent("keydown", {
      key: "A",
      bubbles: true,
    });
    Object.defineProperty(eventOn, "getModifierState", {
      value: (key: string) => key === "CapsLock",
    });
    fireEvent(input, eventOn);

    await waitFor(() => {
      expect(screen.getByText("Caps Lock ativado")).toBeInTheDocument();
    });

    // Deactivate
    const eventOff = new KeyboardEvent("keyup", {
      key: "A",
      bubbles: true,
    });
    Object.defineProperty(eventOff, "getModifierState", {
      value: (key: string) => false,
    });
    fireEvent(input, eventOff);

    await waitFor(() => {
      expect(screen.queryByText("Caps Lock ativado")).not.toBeInTheDocument();
    });
  });

  it("suppresses Caps Lock warning when there is an error", async () => {
    render(<AuthInput id="caps-error-input" label="Password" type="password" error="Senha inválida" />);
    const input = screen.getByLabelText("Password");

    const event = new KeyboardEvent("keydown", {
      key: "A",
      bubbles: true,
    });
    Object.defineProperty(event, "getModifierState", {
      value: (key: string) => key === "CapsLock",
    });

    fireEvent(input, event);

    await waitFor(() => {
      expect(screen.queryByText("Caps Lock ativado")).not.toBeInTheDocument();
      expect(screen.getByText("Senha inválida")).toBeInTheDocument();
    });
  });

  it("displays visual required indicator when required prop is true", () => {
    render(<AuthInput label="Email" required />);

    // Check for the asterisk
    const asterisk = screen.getByText("*");
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass("text-destructive");
    expect(asterisk).toHaveAttribute("aria-hidden", "true");

    // Check if input has required attribute
    const input = screen.getByRole("textbox");
    expect(input).toBeRequired();
  });

  it("does not display visual required indicator when required prop is false", () => {
    render(<AuthInput label="Email" />);

    expect(screen.queryByText("*")).not.toBeInTheDocument();
    const input = screen.getByRole("textbox");
    expect(input).not.toBeRequired();
  });
});
