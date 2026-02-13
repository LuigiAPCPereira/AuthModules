import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/schemas/auth";
import { getAuthErrorMessage } from "@/lib/errorMessages";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";

interface ForgotPasswordFormProps {
  onSubmit?: (email: string) => Promise<void>;
  onBack?: () => void;
}

const ForgotPasswordForm = ({ onSubmit, onBack }: ForgotPasswordFormProps) => {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleFormSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await onSubmit?.(data.email);
      setSent(true);
    } catch (err: unknown) {
      setError("root", {
        type: "submit",
        message: "Erro ao enviar. Tente novamente.",
      });
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
            Enviamos um link de redefinição para <span className="font-medium text-foreground">{watch("email")}</span>. Verifique também a pasta de spam.
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
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5" noValidate>
        <AuthInput
          id="forgot-email"
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          autoComplete="email"
          autoFocus
          {...register("email")}
        />

        {errors.root && (
          <div
            id="forgot-server-error"
            role="alert"
            aria-live="assertive"
            className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive text-center"
          >
            {errors.root.message}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="auth-btn-primary flex items-center justify-center gap-2">
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          {isSubmitting ? "Enviando..." : "Enviar link"}
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
