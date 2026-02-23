# Authentication Components - Technical Refactoring Guide
**Companion to**: UX_UI_CRO_Analysis_AuthComponents.md
**Focus**: Type safety, validation consistency, code quality

---

## Overview

This document provides technical implementation guidance for the UX/UI recommendations identified in the CRO analysis. Each recommendation includes code examples and migration paths.

---

## 1. Validation System Unification

### Problem
Inconsistent validation patterns across components:
- `LoginForm.tsx`: react-hook-form + Zod ✅
- `SignupForm.tsx`: useState + manual ❌
- `ResetPasswordForm.tsx`: useState + manual ❌
- `ForgotPasswordForm.tsx`: useState + manual ❌

### Solution: Centralized Validation Schemas

**Step 1: Create validation schemas**

```tsx
// src/lib/auth-validation.ts
import { z } from "zod";

/**
 * Email validation schema
 * - Required
 * - Must be valid email format
 */
export const emailSchema = z
  .string()
  .min(1, "E-mail é obrigatório")
  .email("E-mail inválido");

/**
 * Password validation schema
 * - Required
 * - Min 8 characters
 * - Must contain uppercase
 * - Must contain lowercase
 * - Must contain number
 * - Must contain special character
 */
export const passwordSchema = z
  .string()
  .min(1, "Senha é obrigatória")
  .min(8, "Mínimo de 8 caracteres")
  .regex(/[A-Z]/, "Deve conter uma letra maiúscula")
  .regex(/[a-z]/, "Deve conter uma letra minúscula")
  .regex(/\d/, "Deve conter um número")
  .regex(/[^A-Za-z0-9]/, "Deve conter um caractere especial");

/**
 * Name validation schema
 * - Required (unless optional flag)
 * - Min 2 characters
 * - Max 100 characters (reasonable limit)
 */
export const nameSchema = z
  .string()
  .min(1, "Nome é obrigatório")
  .min(2, "Mínimo de 2 caracteres")
  .max(100, "Máximo de 100 caracteres");

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Senha é obrigatória"),
});

/**
 * Signup form schema (with optional name)
 */
export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Reset password schema
 */
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
```

**Step 2: Migrate SignupForm.tsx**

```tsx
// src/components/auth/SignupForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "@/lib/auth-validation";

const SignupForm = ({ onSubmit, onLogin, onGoogleSignIn }: SignupFormProps) => {
  // Remove all useState for form fields
  // Remove manual validate function

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const password = watch("password"); // For PasswordStrengthBar

  const handleSubmit = async (data: SignupFormData) => {
    try {
      await onSubmit?.(data);
    } catch (err: unknown) {
      // Error handling stays same
    }
  };

  return (
    <AuthCard title="Criar conta" subtitle="Preencha os dados abaixo para começar.">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5" noValidate>
        <AuthInput
          id="signup-name"
          label="Nome completo"
          type="text"
          placeholder="Seu nome"
          error={errors.name?.message}
          {...register("name")}
          autoComplete="name"
          autoFocus
        />
        <AuthInput
          id="signup-email"
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register("email")}
          autoComplete="email"
        />
        <AuthInput
          id="signup-password"
          label="Senha"
          type="password"
          placeholder="Mínimo 8 caracteres"
          error={errors.password?.message}
          {...register("password")}
          autoComplete="new-password"
        />

        {/* PasswordStrengthBar still works */}
        <AnimatePresence>
          <PasswordStrengthBar password={password} />
        </AnimatePresence>

        {/* REMOVE confirm password field - see CRO analysis */}

        <button type="submit" disabled={isSubmitting} className="auth-btn-primary">
          {isSubmitting ? "Criando..." : "Criar conta"}
        </button>
      </form>
    </AuthCard>
  );
};
```

**Step 3: Migrate other forms similarly**

Benefits:
- ✅ Type-safe form data
- ✅ Consistent validation rules
- ✅ Auto-generated error messages
- ✅ Easier to maintain
- ✅ Better TypeScript inference

---

## 2. Inline Validation Implementation

### Problem: No real-time validation feedback

**Solution: Add debounced inline validation to AuthInput**

```tsx
// src/components/auth/AuthInput.tsx
import { useState, useRef, useEffect, InputHTMLAttributes, forwardRef } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce"; // Create this hook

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  validateOnBlur?: boolean;
  onValidate?: (value: string) => string | undefined;
  showSuccess?: boolean;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, type, className = "", validateOnBlur, onValidate, showSuccess = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState(false);
    const [inlineError, setInlineError] = useState("");
    const [isValid, setIsValid] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;
    const hasError = error || inlineError;

    // Debounced validation for inline feedback
    const debouncedValue = useDebounce(props.value as string, 300);

    useEffect(() => {
      if (touched && onValidate && debouncedValue !== undefined) {
        const validationError = onValidate(debouncedValue);
        setInlineError(validationError || "");
        setIsValid(!validationError && debouncedValue.length > 0);
      }
    }, [debouncedValue, touched, onValidate]);

    const handleBlur = () => {
      setTouched(true);
      if (validateOnBlur && onValidate) {
        const validationError = onValidate(props.value as string);
        setInlineError(validationError || "");
        setIsValid(!validationError && (props.value as string).length > 0);
      }
    };

    // Determine border/ring colors
    const borderClasses = hasError
      ? "ring-2 ring-destructive border-transparent"
      : isValid && showSuccess
      ? "ring-2 ring-success border-success"
      : "";

    return (
      <div className="space-y-1.5">
        <label className="auth-label" htmlFor={props.id}>
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`auth-input ${isPassword ? "pr-12" : ""} ${borderClasses} ${className}`}
            aria-invalid={!!hasError}
            aria-describedby={hasError ? `${props.id}-error` : undefined}
            onBlur={handleBlur}
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
          {isValid && showSuccess && !isPassword && (
            <CheckCircle size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-success" />
          )}
        </div>
        <AnimatePresence>
          {hasError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="auth-error"
              id={`${props.id}-error`}
              role="alert"
            >
              <AlertCircle size={14} />
              {error || inlineError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
```

**Create debounce hook:**

```tsx
// src/hooks/useDebounce.ts
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

**Usage in forms:**

```tsx
// In SignupForm.tsx
<AuthInput
  id="signup-email"
  label="E-mail"
  type="email"
  placeholder="seu@email.com"
  validateOnBlur // Enable inline validation
  onValidate={(value) => {
    if (!value) return "E-mail é obrigatório";
    if (!isValidEmail(value)) return "E-mail inválido";
    return undefined; // Valid
  }}
  error={errors.email?.message}
  {...register("email")}
  autoComplete="email"
/>
```

---

## 3. Centralized Error Handler

### Problem: Generic error messages

**Solution: Create auth-specific error mapper**

```tsx
// src/lib/auth-errors.ts
export interface AuthErrorContext {
  onSignup?: () => void;
  onLogin?: () => void;
  onForgotPassword?: () => void;
}

export const getAuthErrorMessage = (
  error: unknown,
  context: "login" | "signup" | "reset" | "forgot" | "verify",
  actionContext?: AuthErrorContext
): string => {
  if (error instanceof Error) {
    // Firebase Auth error codes
    if (error.message.includes("auth/user-not-found") || error.message.includes("auth/invalid-email")) {
      if (context === "login" && actionContext?.onSignup) {
        return `E-mail não cadastrado. <a href="#" onclick="window.signupAction()">Criar conta</a>`;
      }
      return "E-mail não cadastrado.";
    }
    if (error.message.includes("auth/wrong-password")) {
      if (actionContext?.onForgotPassword) {
        return `Senha incorreta. <a href="#" onclick="window.forgotAction()">Esqueceu a senha?</a>`;
      }
      return "Senha incorreta.";
    }
    if (error.message.includes("auth/email-already-in-use")) {
      if (actionContext?.onLogin) {
        return `Este e-mail já está cadastrado. <a href="#" onclick="window.loginAction()">Fazer login</a>`;
      }
      return "Este e-mail já está cadastrado.";
    }
    if (error.message.includes("auth/weak-password")) {
      return "A senha é muito fraca. Adicione mais caracteres, números ou símbolos.";
    }
    if (error.message.includes("auth/too-many-requests")) {
      return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
    }
    if (error.message.includes("auth/expired-action-code")) {
      return "O código expirou. Solicite um novo código.";
    }
    if (error.message.includes("auth/invalid-action-code")) {
      return "Código incorreto. Verifique e tente novamente.";
    }
    if (error.message.includes("auth/user-disabled")) {
      return "Esta conta foi desativada. Entre em contato com o suporte.";
    }
    if (error.message.includes("auth/requires-recent-login")) {
      return "Esta ação requer login recente. Faça login novamente e tente.";
    }
  }

  // Network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return "Erro de conexão. Verifique sua internet e tente novamente.";
  }

  // Generic fallback
  return "Ocorreu um erro. Tente novamente.";
};
```

**Usage in components:**

```tsx
// In LoginForm.tsx
const handleFormSubmit = async (data: LoginFormData) => {
  setServerError("");
  try {
    await onSubmit?.(data);
  } catch (err: unknown) {
    // Use centralized handler
    setServerError(
      getAuthErrorMessage(err, "login", {
        onSignup: () => onSignup?.(),
        onForgotPassword: () => onForgotPassword?.(),
      })
    );
  }
};

// Setup global actions for error links
useEffect(() => {
  (window as any).signupAction = () => onSignup?.();
  (window as any).forgotAction = () => onForgotPassword?.();
}, [onSignup, onForgotPassword]);
```

---

## 4. Remove Password Confirmation Field

### Problem: Password confirmation creates 10-25% friction

**Solution: Remove confirmation, enhance password visibility**

```tsx
// In SignupForm.tsx - REMOVE this block:
{/* <AuthInput
  id="signup-confirm"
  label="Confirmar senha"
  type="password"
  placeholder="Repita a senha"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  error={errors.confirmPassword}
  autoComplete="new-password"
/> */}

// REPLACE with enhanced password field:
<div className="space-y-2">
  <AuthInput
    id="signup-password"
    label="Senha"
    type="password"
    placeholder="Mínimo 8 caracteres"
    error={errors.password?.message}
    {...register("password")}
    autoComplete="new-password"
  />

  {/* Add explicit show/hide instruction */}
  <p className="text-xs text-auth-subtle flex items-center gap-1.5">
    <Eye size={12} />
    Use o ícone de olho para verificar sua senha
  </p>

  <AnimatePresence>
    <PasswordStrengthBar password={password} />
  </AnimatePresence>
</div>

// Update validation schema to not require confirmation:
// Already using signupSchema which doesn't have confirmPassword
```

**If password confirmation is absolutely required** (compliance, etc.), make it optional:

```tsx
// Optional confirmation field
<AuthInput
  id="signup-confirm"
  label="Confirmar senha"
  type="password"
  placeholder="Opcional: digite novamente para verificar"
  {...register("confirmPassword")}
  autoComplete="new-password"
/>

// In validation schema:
export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().optional(), // Optional
});
```

---

## 5. Progressive Profiling Implementation

### Problem: Collecting all data upfront creates 25-50% drop-off

**Solution: Split signup into 2 steps**

**Step 1: Create minimal signup form**

```tsx
// src/components/auth/SignupFormStep1.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, ArrowRight } from "lucide-react";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";

const minimalSignupSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type MinimalSignupData = z.infer<typeof minimalSignupSchema>;

interface SignupFormStep1Props {
  onSubmit: (data: MinimalSignupData) => Promise<void>;
  onGoogleSignIn?: () => Promise<void>;
}

const SignupFormStep1 = ({ onSubmit, onGoogleSignIn }: SignupFormStep1Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MinimalSignupData>({
    resolver: zodResolver(minimalSignupSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <AuthCard
      title="Criar conta"
      subtitle="Comece com seu e-mail e senha."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <AuthInput
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register("email")}
          autoFocus
        />
        <AuthInput
          label="Senha"
          type="password"
          placeholder="Mínimo 8 caracteres"
          error={errors.password?.message}
          {...register("password")}
        />

        <button type="submit" disabled={isSubmitting} className="auth-btn-primary">
          {isSubmitting ? "Criando..." : "Continuar"}
          <ArrowRight size={18} className="ml-2" />
        </button>
      </form>

      <div className="auth-divider">
        <span className="text-xs text-auth-subtle">ou</span>
      </div>

      <GoogleSignInButton onGoogleSignIn={onGoogleSignIn} />
    </AuthCard>
  );
};

export default SignupFormStep1;
```

**Step 2: Create enrichment form**

```tsx
// src/components/auth/SignupFormStep2.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus } from "lucide-react";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";

const enrichmentSchema = z.object({
  name: z.string().optional(), // Optional
});

type EnrichmentData = z.infer<typeof enrichmentSchema>;

interface SignupFormStep2Props {
  onSubmit: (data: EnrichmentData) => Promise<void>;
  onSkip?: () => void;
}

const SignupFormStep2 = ({ onSubmit, onSkip }: SignupFormStep2Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnrichmentData>({
    resolver: zodResolver(enrichmentSchema),
  });

  return (
    <AuthCard
      title="Como devemos chamar você?"
      subtitle="Opcional: seu nome ajuda a personalizar sua experiência."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <AuthInput
          label="Nome"
          type="text"
          placeholder="Seu nome (ou deixe em branco)"
          error={errors.name?.message}
          {...register("name")}
          autoFocus
        />

        <p className="text-xs text-auth-subtle">
          Você pode adicionar seu nome mais tarde nas configurações.
        </p>

        <div className="flex gap-3">
          <button type="submit" disabled={isSubmitting} className="auth-btn-primary">
            {isSubmitting ? "Salvando..." : "Salvar e continuar"}
          </button>
          <button type="button" onClick={onSkip} className="auth-btn-secondary">
            Pular por agora
          </button>
        </div>
      </form>
    </AuthCard>
  );
};

export default SignupFormStep2;
```

**Step 3: Update Index.tsx to handle multi-step flow**

```tsx
// In Index.tsx, modify signup screen:
{active === "signup" && (
  <SignupForm
    onSubmit={async (data) => {
      await simulateAsync();
      // Move to enrichment step
      setActive("signup-enrich");
    }}
    onLogin={() => setActive("login")}
    onGoogleSignIn={simulateAsync}
  />
)}
{active === "signup-enrich" && (
  <SignupFormStep2
    onSubmit={async (data) => {
      await simulateAsync();
      // Move to email verification or dashboard
      setActive("verify");
    }}
    onSkip={() => {
      // Skip enrichment, go to verification
      setActive("verify");
    }}
  />
)}
```

---

## 6. Auto-Redirect on Success

### Problem: Users must manually click "Continue" after success

**Solution: Add auto-redirect with manual override**

```tsx
// In EmailVerified.tsx
import { useState, useEffect } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import AuthCard from "./AuthCard";

interface EmailVerifiedProps {
  onContinue?: () => void;
  autoRedirectDelay?: number; // Configurable, default 2000ms
}

const EmailVerified = ({
  onContinue,
  autoRedirectDelay = 2000
}: EmailVerifiedProps) => {
  const [countdown, setCountdown] = useState(autoRedirectDelay / 1000);

  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue?.();
    }, autoRedirectDelay);

    const countdownTimer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, [autoRedirectDelay, onContinue]);

  return (
    <AuthCard title="E-mail verificado!" subtitle="Sua conta foi verificada com sucesso.">
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="auth-success-icon !w-20 !h-20"
        >
          <CheckCircle size={36} />
        </motion.div>
        <p className="text-sm text-auth-subtle">
          Tudo pronto! Redirecionando para o dashboard...
        </p>
        <button type="button" onClick={onContinue} className="auth-btn-primary">
          Ir agora ({countdown}s)
        </button>
      </div>
    </AuthCard>
  );
};

export default EmailVerified;
```

---

## 7. Trust Signals Component

### Problem: No trust indicators near forms

**Solution: Create reusable trust signals component**

```tsx
// src/components/auth/TrustSignals.tsx
import { Lock, Shield, CheckCircle } from "lucide-react";
import { ReactNode } from "react";

interface TrustSignal {
  icon: ReactNode;
  text: string;
}

interface TrustSignalsProps {
  signals?: TrustSignal[];
  variant?: "compact" | "full";
}

const defaultSignals: TrustSignal[] = [
  { icon: <Lock size={14} />, text: "Criptografia SSL" },
  { icon: <Shield size={14} />, text: "Privacidade protegida" },
  { icon: <CheckCircle size={14} />, text: "Sem spam" },
];

const TrustSignals = ({
  signals = defaultSignals,
  variant = "full"
}: TrustSignalsProps) => {
  if (variant === "compact") {
    return (
      <div className="flex items-center justify-center gap-4 text-xs text-auth-subtle">
        {signals.map((signal, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="text-muted-foreground">{signal.icon}</span>
            <span>{signal.text}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t flex items-center justify-center gap-6 text-xs text-auth-subtle">
      {signals.map((signal, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="text-muted-foreground">{signal.icon}</span>
          <span>{signal.text}</span>
        </div>
      ))}
    </div>
  );
};

export default TrustSignals;
```

**Usage in forms:**

```tsx
// In SignupForm.tsx, add before closing </AuthCard>:
<TrustSignals />

// In LoginForm.tsx:
<p className="mt-4 text-center text-xs text-auth-subtle flex items-center justify-center gap-1.5">
  <Lock size={12} />
  Sessão segura com criptografia
</p>
```

---

## 8. Resend Countdown Timer

### Problem: No countdown for resend email/code

**Solution: Add countdown with auto-enable**

```tsx
// In EmailVerification.tsx
const [resendCountdown, setResendCountdown] = useState(0);
const [canResend, setCanResend] = useState(true);

// Update handleResend:
const handleResend = async () => {
  setResending(true);
  try {
    await onResend?.();
    // Start countdown
    setCanResend(false);
    setResendCountdown(60);

    const timer = setInterval(() => {
      setResendCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  } finally {
    setResending(false);
  }
};

// Update resend button:
<button
  type="button"
  onClick={handleResend}
  disabled={resending || !canResend}
  className="auth-link disabled:opacity-50"
>
  {resending ? "Reenviando..." : resendCountdown > 0 ? `Aguarde ${resendCountdown}s` : "Reenviar"}
</button>
```

---

## 9. Password Requirements Inline Display

### Problem: Requirements shown only after error

**Solution: Show requirements proactively below password field**

```tsx
// In SignupForm.tsx, after password input:
<div className="space-y-3">
  <AuthInput
    id="signup-password"
    label="Senha"
    type="password"
    placeholder="Mínimo 8 caracteres"
    error={errors.password?.message}
    {...register("password")}
    autoComplete="new-password"
  />

  {/* Add proactive requirements display */}
  {!password || password.length < 8 ? (
    <div className="text-xs text-auth-subtle p-3 rounded-lg bg-secondary/50 space-y-1.5">
      <p className="font-medium">Sua senha deve conter:</p>
      <ul className="space-y-1">
        <li className="flex items-center gap-2">
          <span className={password.length >= 8 ? "text-success" : "text-muted-foreground"}>
            {password.length >= 8 ? "✓" : "○"}
          </span>
          Mínimo de 8 caracteres
        </li>
        <li className="flex items-center gap-2">
          <span className={/[A-Z]/.test(password) ? "text-success" : "text-muted-foreground"}>
            {/[A-Z]/.test(password) ? "✓" : "○"}
          </span>
          Uma letra maiúscula
        </li>
        <li className="flex items-center gap-2">
          <span className={/[a-z]/.test(password) ? "text-success" : "text-muted-foreground"}>
            {/[a-z]/.test(password) ? "✓" : "○"}
          </span>
          Uma letra minúscula
        </li>
        <li className="flex items-center gap-2">
          <span className={/\d/.test(password) ? "text-success" : "text-muted-foreground"}>
            {/\d/.test(password) ? "✓" : "○"}
          </span>
          Um número
        </li>
        <li className="flex items-center gap-2">
          <span class={/[^A-Za-z0-9]/.test(password) ? "text-success" : "text-muted-foreground"}>
            {/[^A-Za-z0-9]/.test(password) ? "✓" : "○"}
          </span>
          Um caractere especial
        </li>
      </ul>
    </div>
  ) : (
    <AnimatePresence>
      <PasswordStrengthBar password={password} />
    </AnimatePresence>
  )}
</div>
```

---

## 10. Enhanced Forgot Password Placement

### Problem: "Forgot password" link may be missed (top-right)

**Solution: Move below password field with helper text**

```tsx
// In LoginForm.tsx, replace:
<div className="flex justify-end">
  <button type="button" onClick={onForgotPassword} className="auth-link">
    Esqueceu a senha?
  </button>
</div>

// WITH:
<div className="flex justify-between items-center py-1">
  <label className="flex items-center gap-2 text-sm text-auth-subtle cursor-pointer hover:text-foreground transition-colors">
    <input type="checkbox" {...register("remember")} className="rounded" />
    Lembrar de mim
  </label>
  <button type="button" onClick={onForgotPassword} className="auth-link text-xs">
    Esqueceu a senha?
  </button>
</div>
```

---

## Migration Checklist

### Phase 1: Validation Unification (Week 1)
- [ ] Create `src/lib/auth-validation.ts` with all schemas
- [ ] Migrate `SignupForm.tsx` to react-hook-form + Zod
- [ ] Migrate `ForgotPasswordForm.tsx` to react-hook-form + Zod
- [ ] Migrate `ResetPasswordForm.tsx` to react-hook-form + Zod
- [ ] Test all validations work correctly
- [ ] Remove manual validation code

### Phase 2: UX Improvements (Week 2)
- [ ] Remove password confirmation from SignupForm
- [ ] Add TrustSignals component to SignupForm
- [ ] Add TrustSignals component to LoginForm
- [ ] Implement inline validation in AuthInput
- [ ] Create useDebounce hook
- [ ] Test inline validation doesn't spam errors

### Phase 3: Error Handling (Week 2)
- [ ] Create `src/lib/auth-errors.ts`
- [ ] Integrate getAuthErrorMessage in LoginForm
- [ ] Integrate getAuthErrorMessage in SignupForm
- [ ] Integrate getAuthErrorMessage in ForgotPasswordForm
- [ ] Integrate getAuthErrorMessage in ResetPasswordForm
- [ ] Integrate getAuthErrorMessage in EmailVerification
- [ ] Test all error scenarios

### Phase 4: Micro-Interactions (Week 3)
- [ ] Add auto-redirect to EmailVerified (2s countdown)
- [ ] Add auto-redirect to ResetPasswordForm success state
- [ ] Add resend countdown to EmailVerification
- [ ] Add shake animation on verification error
- [ ] Keep code on error (don't clear inputs)
- [ ] Test all animations and timers

### Phase 5: Progressive Profiling (Week 4) - OPTIONAL
- [ ] Create SignupFormStep1 (email + password only)
- [ ] Create SignupFormStep2 (name optional)
- [ ] Update Index.tsx to handle multi-step flow
- [ ] A/B test vs single-step form
- [ ] Measure impact on signup completion

---

## Testing Checklist

### Validation Testing
- [ ] Required fields show errors when empty
- [ ] Email validates format (user@domain.com)
- [ ] Password validates all 5 requirements
- [ ] Inline validation shows on blur
- [ ] Inline validation debounces (300ms)
- [ ] Error messages are clear and actionable

### Error Handling Testing
- [ ] "Email not found" shows signup link
- [ ] "Wrong password" shows forgot password link
- [ ] "Email already exists" shows login link
- [ ] "Too many requests" shows wait message
- [ ] "Code expired" shows resend option
- [ ] Generic fallback for unknown errors

### Flow Testing
- [ ] Signup → Email verification → Verified → Dashboard
- [ ] Login with valid credentials → Dashboard
- [ ] Login with invalid → Specific error → Recovery
- [ ] Forgot password → Email sent → Reset → Login
- [ ] Logout confirmation → Logged out state
- [ ] All flows work in dark mode

### Accessibility Testing
- [ ] All inputs have labels
- [ ] All errors have ARIA alerts
- [ ] Focus moves to first error on submit
- [ ] Password toggle works with keyboard
- [ ] All buttons have focus states
- [ ] Screen reader announces errors

---

## Performance Considerations

### Bundle Size Impact
- react-hook-form: ~13KB gzipped (already using)
- @hookform/resolvers: ~3KB gzipped
- zod: ~10KB gzipped
- Framer Motion: ~30KB gzipped (already using)

**Total additional**: ~13KB for validation consistency
**Trade-off**: Worth it for type safety + UX consistency

### Runtime Performance
- Debounced validation: No performance impact (300ms delay)
- Inline success states: Minimal DOM impact
- Auto-redirect timers: Negligible (simple intervals)
- Animations: Already using Framer Motion, no change

---

## Conclusion

This refactoring guide provides implementation paths for all recommendations in the CRO analysis. Prioritize:

1. **Quick wins** (Phase 1-2): Validation + Trust signals
2. **Error handling** (Phase 3): Critical for recovery
3. **Micro-interactions** (Phase 4): Polish and delight
4. **Progressive profiling** (Phase 5): Test first, measure impact

Expected outcomes:
- ✅ +25-40% signup completion
- ✅ +15-25% login completion
- ✅ +30% error recovery rate
- ✅ Consistent codebase (easier maintenance)
- ✅ Type-safe forms (fewer runtime bugs)
