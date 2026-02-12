import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import AuthInput from "@/components/auth/AuthInput";

const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").min(2, "Mínimo 2 caracteres"),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileForm = () => {
  const { user, updateUser } = useUser();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    updateUser({ name: data.name!, phone: data.phone || "" });
    toast({ title: "Perfil atualizado com sucesso!" });
    setSaving(false);
  };

  return (
    <div className="auth-card">
      <h3 className="text-lg font-semibold text-foreground mb-6">Dados Pessoais</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <AuthInput
          id="profile-name"
          label="Nome completo"
          type="text"
          placeholder="Seu nome"
          error={errors.name?.message}
          autoComplete="name"
          {...register("name")}
        />
        <div>
          <label className="auth-label" htmlFor="profile-email">E-mail</label>
          <input
            id="profile-email"
            type="email"
            value={user.email}
            readOnly
            className="auth-input opacity-60 cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">O e-mail não pode ser alterado.</p>
        </div>
        <AuthInput
          id="profile-phone"
          label="Telefone"
          type="tel"
          placeholder="(00) 00000-0000"
          error={errors.phone?.message}
          autoComplete="tel"
          {...register("phone")}
        />
        <button type="submit" disabled={saving} className="auth-btn-primary flex items-center justify-center gap-2">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
