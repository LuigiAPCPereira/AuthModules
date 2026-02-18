import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, KeyRound } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/schemas/auth";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import FormPasswordStrength from "./FormPasswordStrength";

interface ResetPasswordFormProps {
  onSubmit?: (password: string) => Promise<void>;
  onLogin?: () => void;
}

const ResetPasswordForm = ({ onSubmit, onLogin }: ResetPasswordFormProps) => {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleFormSubmit = async (data: ResetPasswordFormData) => {
    try {
      await onSubmit?.(data.password);
      setSuccess(true);
    } catch (err: unknown) {
      // For now, re-throw or handle as needed.
      // Assuming parent handles it or swallowed by hook form if not set on root.
      // Log to a secure monitoring service instead
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
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5" noValidate>
        <AuthInput
          id="reset-password"
          label="Nova senha"
          type="password"
          placeholder="Mínimo 8 caracteres"
          error={errors.password?.message}
          autoComplete="new-password"
          autoFocus
          {...register("password")}
        />

        <FormPasswordStrength control={control} name="password" />

        {errors.root && (
          <div
            id="reset-server-error"
            role="alert"
            aria-live="assertive"
            className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive text-center"
          >
            {errors.root.message}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="auth-btn-primary flex items-center justify-center gap-2">
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <KeyRound size={18} />}
          {isSubmitting ? "Redefinindo..." : "Redefinir senha"}
        </button>
      </form>
    </AuthCard>
  );
};

export default ResetPasswordForm;
