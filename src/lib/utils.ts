import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EMAIL_REGEX } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isValidEmail = (email: string) => {
  return EMAIL_REGEX.test(email);
};
