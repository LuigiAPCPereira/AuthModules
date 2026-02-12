import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AuthInput from "@/components/auth/AuthInput";
import PasswordStrengthBar from "@/components/auth/PasswordStrengthBar";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(1, "Nova senha é obrigatória")
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Precisa de letra maiúscula")
      .regex(/[a-z]/, "Precisa de letra minúscula")
      .regex(/\d/, "Precisa de número")
      .regex(/[^A-Za-z0-9]/, "Precisa de caractere especial"),
    confirmPassword: z.string().min(1, "Confirmação é obrigatória"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const ChangePasswordForm = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast({ title: "Senha alterada com sucesso!" });
    reset();
    setSaving(false);
  };

  return (
    <div className="auth-card">
      <h3 className="text-lg font-semibold text-foreground mb-6">Segurança</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <AuthInput
          id="current-password"
          label="Senha atual"
          type="password"
          placeholder="••••••••"
          error={errors.currentPassword?.message}
          autoComplete="current-password"
          {...register("currentPassword")}
        />
        <div className="space-y-3">
          <AuthInput
            id="new-password"
            label="Nova senha"
            type="password"
            placeholder="••••••••"
            error={errors.newPassword?.message}
            autoComplete="new-password"
            {...register("newPassword")}
          />
          <PasswordStrengthBar password={newPassword} />
        </div>
        <AuthInput
          id="confirm-password"
          label="Confirmar nova senha"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
        <button type="submit" disabled={saving} className="auth-btn-primary flex items-center justify-center gap-2">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
          {saving ? "Alterando..." : "Alterar senha"}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
