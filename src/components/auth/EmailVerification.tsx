import { useState } from "react";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";
import AuthCard from "./AuthCard";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface EmailVerificationProps {
  email?: string;
  onVerify?: (code: string) => Promise<void>;
  onResend?: () => Promise<void>;
  onBack?: () => void;
}

const DIGIT_REGEX = /^\d*$/;

const EmailVerification = ({ email = "seu@email.com", onVerify, onResend, onBack }: EmailVerificationProps) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  const handleComplete = async (code: string) => {
    setLoading(true);
    try {
      await onVerify?.(code);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Código inválido. Tente novamente.");
      setValue("");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (newValue: string) => {
    if (!DIGIT_REGEX.test(newValue)) return;
    setValue(newValue);
    if (error) setError("");
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await onResend?.();
      setValue("");
      setError("");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthCard title="Verificar e-mail" subtitle="Insira o código de 6 dígitos enviado para o seu e-mail.">
      <div className="text-center mb-8">
        <div className="auth-success-icon !mb-4" style={{ color: "hsl(var(--primary))", backgroundColor: "hsl(var(--primary) / 0.1)" }}>
          <Mail size={28} />
        </div>
        <p className="text-sm text-auth-subtle">
          Código enviado para <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <InputOTP
          maxLength={6}
          value={value}
          onChange={handleChange}
          onComplete={handleComplete}
          containerClassName="gap-3"
          disabled={loading}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="w-12 h-14 text-xl font-semibold rounded-md border shadow-sm" />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot index={1} className="w-12 h-14 text-xl font-semibold rounded-md border shadow-sm" />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot index={2} className="w-12 h-14 text-xl font-semibold rounded-md border shadow-sm" />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot index={3} className="w-12 h-14 text-xl font-semibold rounded-md border shadow-sm" />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot index={4} className="w-12 h-14 text-xl font-semibold rounded-md border shadow-sm" />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot index={5} className="w-12 h-14 text-xl font-semibold rounded-md border shadow-sm" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center mb-4">{error}</p>
      )}

      {loading && (
        <div className="flex justify-center mb-4">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      )}

      <p className="text-center text-sm text-auth-subtle">
        Não recebeu o código?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="auth-link disabled:opacity-50"
        >
          {resending ? "Reenviando..." : "Reenviar"}
        </button>
      </p>

      <button type="button" onClick={onBack} className="mt-6 flex items-center justify-center gap-1.5 mx-auto auth-link">
        <ArrowLeft size={14} />
        Voltar
      </button>
    </AuthCard>
  );
};

export default EmailVerification;
