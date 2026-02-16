import { useState, InputHTMLAttributes, forwardRef, useId } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, type, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    // Auto-generate a unique ID if none is provided.
    // This ensures that the label is always correctly associated with the input (click-to-focus)
    // and that screen readers can announce the field correctly, even if the developer forgets to pass an ID.
    const generatedId = useId();
    const id = props.id || generatedId;

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-1.5">
        <label className="auth-label" htmlFor={id}>
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            ref={ref}
            type={inputType}
            className={`auth-input ${isPassword ? "pr-12" : ""} ${error ? "ring-2 ring-destructive border-transparent" : ""} ${className}`}
            aria-invalid={!!error}
            // Associates the error message with the input field for screen readers
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="auth-error"
              id={`${id}-error`}
              role="alert"
            >
              <AlertCircle size={14} />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
