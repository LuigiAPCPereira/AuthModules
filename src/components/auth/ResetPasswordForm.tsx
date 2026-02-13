import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, KeyRound } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { isPasswordStrong } from "@/lib/utils";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/schemas/auth";
import { getAuthErrorMessage } from "@/lib/errorMessages";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import PasswordStrengthBar from "./PasswordStrengthBar";

interface ResetPasswordFormProps {
  onSubmit?: (password: string) => Promise<void>;
  onLogin?: () => void;
}

const ResetPasswordForm = ({ onSubmit, onLogin }: ResetPasswordFormProps) => {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
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
      setError("root", {
        message: getAuthErrorMessage(err),
      });
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

        <AnimatePresence>
          <PasswordStrengthBar password={watch("password")} />
        </AnimatePresence>

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
