import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AuthInput from "../../../components/auth/AuthInput";
import React from "react";

describe("AuthInput", () => {
  it("renders label and input", () => {
    render(<AuthInput label="Email" placeholder="Enter email" />);

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
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
});
