import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, UserPlus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { signupSchema, type SignupFormData } from "@/lib/schemas/auth";
import { getAuthErrorMessage } from "@/lib/errorMessages";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import GoogleSignInButton from "./GoogleSignInButton";

interface SignupFormProps {
  onSubmit?: (data: { name: string; email: string; password: string }) => Promise<void>;
  onLogin?: () => void;
  onGoogleSignIn?: () => Promise<void>;
}

const SignupForm = ({ onSubmit, onLogin, onGoogleSignIn }: SignupFormProps) => {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = async (data: SignupFormData) => {
    setServerError("");
    try {
      await onSubmit?.(data);
    } catch (err: unknown) {
      setServerError(getAuthErrorMessage(err));
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
          autoComplete="name"
          autoFocus
          {...register("name")}
        />
        <AuthInput
          id="signup-email"
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          autoComplete="email"
          {...register("email")}
        />
        <AuthInput
          id="signup-password"
          label="Senha"
          type="password"
          placeholder="Mínimo 8 caracteres"
          error={errors.password?.message}
          autoComplete="new-password"
          {...register("password")}
        />

        <AnimatePresence>
          {/* ⚡ Performance Optimization: Using PasswordStrengthIndicator instead of watch("password")
              to prevent re-rendering the entire form on every keystroke. */}
          <PasswordStrengthIndicator control={control} />
        </AnimatePresence>

        {serverError && (
          <div
            id="signup-server-error"
            role="alert"
            aria-live="assertive"
            className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive text-center"
          >
            {serverError}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="auth-btn-primary flex items-center justify-center gap-2">
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
          {isSubmitting ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <div className="auth-divider">
        <span className="text-xs text-auth-subtle">ou</span>
      </div>

      <GoogleSignInButton onGoogleSignIn={onGoogleSignIn} label="Registrar com Google" />

      <p className="mt-8 text-center text-sm text-auth-subtle">
        Já tem uma conta?{" "}
        <button type="button" onClick={onLogin} className="auth-link">
          Entrar
        </button>
      </p>
    </AuthCard>
  );
};

export default SignupForm;
