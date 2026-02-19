import { useState, useCallback, InputHTMLAttributes, forwardRef, useId } from "react";
import { Eye, EyeOff, AlertCircle, TriangleAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, type, className = "", id: propsId, onKeyDown, onKeyUp, onClick, ...props }, ref) => {
    // Auto-generate a unique ID if none is provided.
    // This ensures that the label is always correctly associated with the input (click-to-focus)
    // and that screen readers can announce the field correctly, even if the developer forgets to pass an ID.
    const generatedId = useId();
    const id = propsId ?? generatedId;
    const [showPassword, setShowPassword] = useState(false);
    const [capsLockActive, setCapsLockActive] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const checkCapsLock = useCallback((e: React.KeyboardEvent | React.MouseEvent) => {
      if (e.getModifierState) {
        setCapsLockActive(e.getModifierState("CapsLock"));
      }
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      checkCapsLock(e);
      onKeyDown?.(e);
    }, [checkCapsLock, onKeyDown]);

    const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      checkCapsLock(e);
      onKeyUp?.(e);
    }, [checkCapsLock, onKeyUp]);

    const handleClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
      checkCapsLock(e);
      onClick?.(e);
    }, [checkCapsLock, onClick]);

    return (
      <div className="space-y-1.5">
        <label className="auth-label" htmlFor={id}>
          {label}
        </label>
        <div className="relative">
          <input
            {...props}
            ref={ref}
            type={inputType}
            id={id}
            className={`auth-input ${isPassword ? "pr-12" : ""} ${error ? "ring-2 ring-destructive border-transparent" : ""} ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onClick={handleClick}
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
              key="error"
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
          {!error && capsLockActive && isPassword && (
            <motion.p
              key="caps-warning"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-sm mt-1.5 flex items-center gap-1.5 text-[hsl(var(--warning))]"
              id={`${id}-caps-warning`}
              role="alert"
            >
              <TriangleAlert size={14} />
              Caps Lock ativado
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
