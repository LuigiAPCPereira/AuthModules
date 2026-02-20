import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/schemas/auth";
import { getAuthErrorMessage, AUTH_ERROR_MESSAGES } from "@/lib/errorMessages";
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
      // Security: We catch all errors and show success message to prevent user enumeration.
      // Only network/server errors should be shown to the user so they can retry.
      const message = getAuthErrorMessage(err);

      const networkErrors = [
        AUTH_ERROR_MESSAGES.NETWORK_ERROR,
        AUTH_ERROR_MESSAGES.SERVER_UNAVAILABLE,
        AUTH_ERROR_MESSAGES.TIMEOUT,
      ];

      if (networkErrors.includes(message)) {
        setError("root", { message });
        return;
      }

      // For all other errors (including "Email not found"), we pretend success.
      // In a real app, we should log this error to a monitoring service.
      // Log to a secure monitoring service instead
      setSent(true);
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
          required
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
