import { Control, useWatch } from "react-hook-form";
import { AnimatePresence } from "framer-motion";
import PasswordStrengthBar from "./PasswordStrengthBar";

interface PasswordStrengthIndicatorProps {
  control: Control<any>;
}

const PasswordStrengthIndicator = ({ control }: PasswordStrengthIndicatorProps) => {
  const password = useWatch({
    control,
    name: "password",
  });

  return (
    <AnimatePresence>
      <PasswordStrengthBar password={password || ""} />
    </AnimatePresence>
  );
};

export default PasswordStrengthIndicator;
