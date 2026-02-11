import { useState, FormEvent } from "react";
import { Loader2, UserPlus } from "lucide-react";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";

interface SignupFormProps {
  onSubmit?: (data: { name: string; email: string; password: string }) => Promise<void>;
  onLogin?: () => void;
}

const SignupForm = ({ onSubmit, onLogin }: SignupFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Nome é obrigatório";
    if (!email.trim()) e.email = "E-mail é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "E-mail inválido";
    if (!password) e.password = "Senha é obrigatória";
    else if (password.length < 8) e.password = "Mínimo de 8 caracteres";
    if (password !== confirmPassword) e.confirmPassword = "As senhas não coincidem";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit?.({ name, email, password });
    } catch (err: any) {
      setServerError(err?.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Criar conta" subtitle="Preencha os dados abaixo para começar.">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthInput
          id="signup-name"
          label="Nome completo"
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoComplete="name"
          autoFocus
        />
        <AuthInput
          id="signup-email"
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <AuthInput
          id="signup-password"
          label="Senha"
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />
        <AuthInput
          id="signup-confirm"
          label="Confirmar senha"
          type="password"
          placeholder="Repita a senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        {serverError && (
          <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive text-center">
            {serverError}
          </div>
        )}

        <button type="submit" disabled={loading} className="auth-btn-primary flex items-center justify-center gap-2">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>

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
