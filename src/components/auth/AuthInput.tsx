import { useState, InputHTMLAttributes, forwardRef, useId, memo } from "react";
import { Eye, EyeOff, AlertCircle, TriangleAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, type, className = "", id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isCapsLockActive, setIsCapsLockActive] = useState(false);
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const capsWarningId = `${inputId}-caps-warning`;

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const checkCapsLock = (e: React.KeyboardEvent | React.MouseEvent) => {
      if (e.getModifierState) {
        setIsCapsLockActive(e.getModifierState("CapsLock"));
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
      // CapsLock detection runs only on keydown and click
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      props.onBlur?.(e);
    };

    const descriptionIds = [
      props["aria-describedby"],
      error ? errorId : null,
      isCapsLockActive && isPassword && !error ? capsWarningId : null
    ].filter(Boolean).join(" ") || undefined;

    return (
      <div className="space-y-1.5">
        <label className="auth-label" htmlFor={inputId}>
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              "auth-input",
              isPassword && "pr-12",
              error && "ring-2 ring-destructive border-transparent",
              className
            )}
            aria-invalid={!!error}
            {...props}
            aria-describedby={descriptionIds}
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
          {isCapsLockActive && isPassword && !error && (
            <motion.p
              key="caps-warning"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs font-medium flex items-center gap-1.5 mt-1.5 text-[hsl(var(--warning))]"
              id={capsWarningId}
              role="alert"
            >
              <TriangleAlert size={14} />
              Caps Lock ativado
            </motion.p>
          )}
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="auth-error"
              id={errorId}
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

AuthInput.displayName = "memo(forwardRef(AuthInput))";

export default memo(AuthInput);
