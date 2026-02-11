import { useState, FormEvent } from "react";
import { Loader2, KeyRound } from "lucide-react";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";

interface ResetPasswordFormProps {
  onSubmit?: (password: string) => Promise<void>;
  onLogin?: () => void;
}

const ResetPasswordForm = ({ onSubmit, onLogin }: ResetPasswordFormProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!password) e.password = "Nova senha é obrigatória";
    else if (password.length < 8) e.password = "Mínimo de 8 caracteres";
    if (password !== confirmPassword) e.confirmPassword = "As senhas não coincidem";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit?.(password);
      setSuccess(true);
    } catch (err: any) {
      setServerError(err?.message || "Erro ao redefinir senha.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard title="Senha redefinida" subtitle="Sua senha foi alterada com sucesso.">
        <div className="text-center space-y-4">
          <div className="auth-success-icon">
            <KeyRound size={28} />
          </div>
          <p className="text-sm text-auth-subtle">
            Agora você pode fazer login com sua nova senha.
          </p>
          <button type="button" onClick={onLogin} className="auth-btn-primary">
            Ir para o login
          </button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Redefinir senha" subtitle="Escolha uma nova senha para sua conta.">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthInput
          id="reset-password"
          label="Nova senha"
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
          autoFocus
        />
        <AuthInput
          id="reset-confirm"
          label="Confirmar nova senha"
          type="password"
          placeholder="Repita a nova senha"
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
          {loading ? <Loader2 size={18} className="animate-spin" /> : <KeyRound size={18} />}
          {loading ? "Redefinindo..." : "Redefinir senha"}
        </button>
      </form>
    </AuthCard>
  );
};

export default ResetPasswordForm;
