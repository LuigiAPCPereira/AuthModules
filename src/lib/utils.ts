import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EMAIL_REGEX, STRONG_PASSWORD_REGEX } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isValidEmail = (email: string) => {
  return EMAIL_REGEX.test(email);
};

// Security: Enforce password complexity to mitigate brute-force and credential stuffing attacks.
// Requires: 8+ chars, uppercase, lowercase, number, special char.
export const isPasswordStrong = (password: string) => {
  return STRONG_PASSWORD_REGEX.test(password);
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }
  if (typeof error === 'object' && error !== null) {
    return "";
  }
  return String(error);
};
