import { useState, InputHTMLAttributes, forwardRef } from "react";
import { Eye, EyeOff, AlertCircle, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, type, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [capsLockOn, setCapsLockOn] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const checkCapsLock = (e: React.KeyboardEvent | React.MouseEvent | React.FocusEvent) => {
      if (e.getModifierState) {
        setCapsLockOn(e.getModifierState("CapsLock"));
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      checkCapsLock(e);
      props.onKeyDown?.(e);
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      checkCapsLock(e);
      props.onKeyUp?.(e);
    };

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      checkCapsLock(e);
      props.onClick?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      checkCapsLock(e);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // We could clear Caps Lock warning on blur, but keeping it based on state
      // is more consistent with how the OS behaves (state persists).
      // However, usually we update it on focus.
      props.onBlur?.(e);
    };

    return (
      <div className="space-y-1.5">
        <label className="auth-label" htmlFor={props.id}>
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`auth-input ${isPassword ? "pr-12" : ""} ${error ? "ring-2 ring-destructive border-transparent" : ""} ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onClick={handleClick}
            onFocus={handleFocus}
            onBlur={handleBlur}
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
          {capsLockOn && isPassword && !error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs font-medium flex items-center gap-1.5 mt-1.5 text-[hsl(var(--warning))]"
              role="alert"
            >
              <ArrowUp size={14} />
              Caps Lock ativado
            </motion.p>
          )}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="auth-error"
              id={`${props.id}-error`}
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
