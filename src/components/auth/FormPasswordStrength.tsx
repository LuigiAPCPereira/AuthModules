import { Control, useWatch, FieldValues } from "react-hook-form";
import { AnimatePresence } from "framer-motion";
import PasswordStrengthBar from "./PasswordStrengthBar";

interface FormPasswordStrengthProps<T extends FieldValues> {
  control: Control<T>;
  name: string;
}

const FormPasswordStrength = <T extends FieldValues>({ control, name }: FormPasswordStrengthProps<T>) => {
  const password = useWatch({
    control,
    name,
  });

  return (
    <AnimatePresence>
      <PasswordStrengthBar password={password || ""} />
    </AnimatePresence>
  );
};

export default FormPasswordStrength;
