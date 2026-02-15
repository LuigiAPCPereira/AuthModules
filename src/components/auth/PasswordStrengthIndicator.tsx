import { Control, useWatch } from "react-hook-form";
import PasswordStrengthBar from "./PasswordStrengthBar";

interface PasswordStrengthIndicatorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name?: string;
}

/**
 * ⚡ Performance Optimization:
 * This component isolates the subscription to the password field using `useWatch`.
 * By moving this logic into a separate component, we prevent the entire parent form
 * (e.g., SignupForm, ResetPasswordForm) from re-rendering on every keystroke.
 */
const PasswordStrengthIndicator = ({ control, name = "password" }: PasswordStrengthIndicatorProps) => {
  const password = useWatch({
    control,
    name,
    defaultValue: "",
  });

  return <PasswordStrengthBar password={typeof password === "string" ? password : ""} />;
};

export default PasswordStrengthIndicator;
