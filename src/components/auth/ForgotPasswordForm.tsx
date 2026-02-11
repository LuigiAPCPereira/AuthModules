import { useState, FormEvent } from "react";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import { isValidEmail } from "@/lib/utils";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import { EMAIL_REGEX } from "../../lib/constants";

interface ForgotPasswordFormProps {
  onSubmit?: (email: string) => Promise<void>;
  onBack?: () => void;
}

const ForgotPasswordForm = ({ onSubmit, onBack }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !isValidEmail(email)) {
      setError("Insira um e-mail válido");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onSubmit?.(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthCard title="E-mail enviado" subtitle="Verifique sua caixa de entrada.">
        <div className="text-center space-y-4">
          <div className="auth-success-icon">
            <Send size={28} />
          </div>
          <p className="text-sm text-auth-subtle">
            Enviamos um link de redefinição para <span className="font-medium text-foreground">{email}</span>. Verifique também a pasta de spam.
          </p>
          <button type="button" onClick={onBack} className="auth-btn-secondary flex items-center justify-center gap-2 mt-4">
            <ArrowLeft size={16} />
            Voltar ao login
          </button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Esqueceu a senha?" subtitle="Insira seu e-mail para receber o link de redefinição.">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthInput
          id="forgot-email"
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          autoComplete="email"
          autoFocus
        />
        <button type="submit" disabled={loading} className="auth-btn-primary flex items-center justify-center gap-2">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          {loading ? "Enviando..." : "Enviar link"}
        </button>
      </form>
      <button type="button" onClick={onBack} className="mt-6 flex items-center justify-center gap-1.5 mx-auto auth-link">
        <ArrowLeft size={14} />
        Voltar ao login
      </button>
    </AuthCard>
  );
};

export default ForgotPasswordForm;
