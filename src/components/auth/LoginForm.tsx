import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, LogIn } from "lucide-react";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import GoogleSignInButton from "./GoogleSignInButton";

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => Promise<void>;
  onForgotPassword?: () => void;
  onSignup?: () => void;
  onGoogleSignIn?: () => Promise<void>;
}

const loginSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória").min(6, "Mínimo de 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

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
    setServerError("");
    try {
      await onSubmit?.({ email: data.email!, password: data.password! });
    } catch (err: unknown) {
      let errorMessage = "";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null && "message" in err) {
        errorMessage = String((err as { message: unknown }).message);
      }
      setServerError(errorMessage || "Erro ao fazer login. Tente novamente.");
    }
  };

  return (
    <AuthCard title="Entrar" subtitle="Bem-vindo de volta. Faça login na sua conta.">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5" noValidate>
        <AuthInput
          id="login-email"
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          error={!isSubmitting ? errors.email?.message : undefined}
          autoComplete="email"
          autoFocus
          {...register("email")}
        />
        <AuthInput
          id="login-password"
          label="Senha"
          type="password"
          placeholder="••••••••"
          error={!isSubmitting ? errors.password?.message : undefined}
          autoComplete="current-password"
          {...register("password")}
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onForgotPassword}
            className="auth-link"
          >
            Esqueceu a senha?
          </button>
        </div>

        {serverError && (
          <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive text-center">
            {serverError}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="auth-btn-primary flex items-center justify-center gap-2">
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
          {isSubmitting ? "Entrando..." : "Entrar"}
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
