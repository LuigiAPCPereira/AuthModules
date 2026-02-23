import { Control, useWatch, FieldValues, Path } from "react-hook-form";
import { AnimatePresence } from "framer-motion";
import PasswordStrengthBar from "./PasswordStrengthBar";

interface FormPasswordStrengthProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  id?: string;
}

const FormPasswordStrength = <T extends FieldValues>({ control, name, id }: FormPasswordStrengthProps<T>) => {
  const password = useWatch({
    control,
    name,
  });

  return (
    <AnimatePresence>
      <PasswordStrengthBar password={password || ""} id={id} />
    </AnimatePresence>
  );
};

export default FormPasswordStrength;
