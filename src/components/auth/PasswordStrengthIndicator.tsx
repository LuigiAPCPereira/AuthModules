import { Control, useWatch, type FieldValues, type Path } from "react-hook-form";
import PasswordStrengthBar from "./PasswordStrengthBar";

interface PasswordStrengthIndicatorProps<T extends FieldValues> {
  control: Control<T>;
  name?: Path<T> | string;
}

/**
 * ⚡ Performance Optimization:
 * This component isolates the subscription to the password field using `useWatch`.
 * By moving this logic into a separate component, we prevent the entire parent form
 * (e.g., SignupForm, ResetPasswordForm) from re-rendering on every keystroke.
 */
const PasswordStrengthIndicator = <T extends FieldValues>({ control, name = "password" }: PasswordStrengthIndicatorProps<T>) => {
  const password = useWatch({
    control: control as unknown as Control<FieldValues>,
    name: name as string,
    defaultValue: "",
  });

  return <PasswordStrengthBar password={typeof password === "string" ? password : ""} />;
};

export default PasswordStrengthIndicator;
