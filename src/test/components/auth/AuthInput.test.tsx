import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthInput from "../../../components/auth/AuthInput";
import React from "react";

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

  it("shows warning when Caps Lock is active", async () => {
    const user = userEvent.setup();
    render(<AuthInput label="Password" type="password" id="caps-test-1" />);
    const input = screen.getByLabelText("Password");

    await user.click(input);
    await user.keyboard("{CapsLock}a");

    expect(await screen.findByText("Caps Lock ativado")).toBeInTheDocument();
  });

  it("hides warning when Caps Lock is inactive", async () => {
    const user = userEvent.setup();
    render(<AuthInput label="Password" type="password" id="caps-test-2" />);
    const input = screen.getByLabelText("Password");

    await user.click(input);
    await user.keyboard("{CapsLock}a");
    expect(await screen.findByText("Caps Lock ativado")).toBeInTheDocument();

    await user.keyboard("{CapsLock}a");

    await waitFor(() => {
      expect(screen.queryByText("Caps Lock ativado")).not.toBeInTheDocument();
    });
  });

  it("does not show Caps Lock warning for non-password inputs", async () => {
    const user = userEvent.setup();
    render(<AuthInput label="Email" type="email" id="caps-test-3" />);
    const input = screen.getByLabelText("Email");

    await user.click(input);
    await user.keyboard("{CapsLock}a");

    expect(screen.queryByText("Caps Lock ativado")).not.toBeInTheDocument();
  });
});
