import { useState, FormEvent } from "react";
import { Loader2, LogIn } from "lucide-react";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import GoogleSignInButton from "./GoogleSignInButton";
import { EMAIL_REGEX } from "../../lib/constants";

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => Promise<void>;
  onForgotPassword?: () => void;
  onSignup?: () => void;
  onGoogleSignIn?: () => Promise<void>;
}

const LoginForm = ({ onSubmit, onForgotPassword, onSignup, onGoogleSignIn }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "E-mail é obrigatório";
    else if (!EMAIL_REGEX.test(email)) newErrors.email = "E-mail inválido";
    if (!password) newErrors.password = "Senha é obrigatória";
    else if (password.length < 6) newErrors.password = "Mínimo de 6 caracteres";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit?.({ email, password });
    } catch (err: any) {
      setServerError(err?.message || "Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Entrar" subtitle="Bem-vindo de volta. Faça login na sua conta.">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthInput
          id="login-email"
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
          autoFocus
        />
        <AuthInput
          id="login-password"
          label="Senha"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
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

        <button type="submit" disabled={loading} className="auth-btn-primary flex items-center justify-center gap-2">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
          {loading ? "Entrando..." : "Entrar"}
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
