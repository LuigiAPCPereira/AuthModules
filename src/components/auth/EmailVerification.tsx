import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { getErrorMessage } from "@/lib/utils";
import AuthCard from "./AuthCard";

interface EmailVerificationProps {
  email?: string;
  onVerify?: (code: string) => Promise<void>;
  onResend?: () => Promise<void>;
  onBack?: () => void;
}

const DIGIT_REGEX = /^\d*$/;

const EmailVerification = ({ email = "seu@email.com", onVerify, onResend, onBack }: EmailVerificationProps) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!DIGIT_REGEX.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError("");
    if (value && index < 5) refs.current[index + 1]?.focus();
    if (newCode.every((d) => d) && newCode.join("").length === 6) {
      submitCode(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split("");
      setCode(newCode);
      refs.current[5]?.focus();
      submitCode(pasted);
    }
  };

  const submitCode = async (fullCode: string) => {
    setLoading(true);
    try {
      await onVerify?.(fullCode);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Código inválido. Tente novamente.");
      setCode(Array(6).fill(""));
      refs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await onResend?.();
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

      <div className="flex justify-center gap-3 mb-6" role="group" aria-label="Código de verificação">
        {code.map((digit, i) => (
          <motion.input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            className="auth-input !w-12 !h-14 !px-0 text-center text-xl font-semibold"
            aria-label={`Dígito ${i + 1}`}
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.15 }}
          />
        ))}
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
