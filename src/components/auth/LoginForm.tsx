import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { getAuthErrorMessage } from "@/lib/errorMessages";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import GoogleSignInButton from "./GoogleSignInButton";
import { rateLimit } from "../../utils/rateLimit";
import { sanitize } from "../../utils/sanitize";

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => Promise<void>;
  onForgotPassword?: () => void;
  onSignup?: () => void;
  onGoogleSignIn?: () => Promise<void>;
}

const LoginForm = ({ onSubmit, onForgotPassword, onSignup, onGoogleSignIn }: LoginFormProps) => {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    // Basic sanitization
    const sanitizedEmail = sanitize(data.email);

    setServerError("");
    // Rate limit checks
    const rl = rateLimit.check("login_attempt", 5, 15);
    if (!rl.allowed) {
      setServerError(`Muitas tentativas. Tente novamente em ${Math.ceil(rl.remainingMs / 60000)} minutos.`);
      return;
    }

    try {
      await onSubmit?.({ ...data, email: sanitizedEmail });
      rateLimit.reset("login_attempt");
    } catch (err: unknown) {
      setServerError(getAuthErrorMessage(err));
    }
  };

  return (
    <AuthCard title="Entrar" subtitle="Bem-vindo de volta. Faça login na sua conta.">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5" noValidate>
        <AuthInput
          id="login-email"
          label="E-mail"
          type="email"
          required
          placeholder="seu@email.com"
          error={!isSubmitting ? errors.email?.message : undefined}
          autoComplete="email"
          {...register("email")}
        />
        <AuthInput
          id="login-password"
          label="Senha"
          type="password"
          required
          placeholder="••••••"
          error={!isSubmitting ? errors.password?.message : undefined}
          autoComplete="current-password"
          {...register("password")}
        />
        <div className="flex items-center gap-2 mt-2">
          <Checkbox id="login-remember-me" className="cursor-pointer" />
          <Label
            htmlFor="login-remember-me"
            className="font-normal text-auth-subtle cursor-pointer"
          >
            Lembrar de mim
          </Label>
        </div>

        <button
          type="button"
          onClick={onForgotPassword}
          className="auth-link mt-2"
        >
          Esqueceu a senha?
        </button>

        {serverError && (
          <div
            id="login-server-error"
            role="alert"
            aria-live="assertive"
            className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive text-center"
          >
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="auth-btn-primary flex items-center justify-center gap-2"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
          {isSubmitting ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <div className="auth-divider">
        <span className="text-xs text-auth-subtle">ou</span>
      </div>

      <GoogleSignInButton onGoogleSignIn={onGoogleSignIn} />

      <p className="mt-8 text-center text-sm text-auth-subtle">
        Não tem uma conta?{" "}
        <button type="button" onClick={onSignup} className="auth-link">
          Criar conta
        </button>
      </p>
    </AuthCard>
  );
};

export default LoginForm;
