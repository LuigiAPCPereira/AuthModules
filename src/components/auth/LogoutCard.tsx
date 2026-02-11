import { useState } from "react";
import { Loader2, LogOut, User } from "lucide-react";
import AuthCard from "./AuthCard";

interface LogoutCardProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => Promise<void>;
  onCancel?: () => void;
}

const LogoutCard = ({ userName = "Usuário", userEmail = "usuario@email.com", onLogout, onCancel }: LogoutCardProps) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await onLogout?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Sair da conta" subtitle="Tem certeza que deseja encerrar sua sessão?">
      <div className="text-center space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={22} />
          </div>
          <div className="text-left">
            <p className="font-medium text-sm text-foreground">{userName}</p>
            <p className="text-xs text-auth-subtle">{userEmail}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="auth-btn-secondary">
            Cancelar
          </button>
          <button type="button" onClick={handleLogout} disabled={loading} className="auth-btn-primary flex items-center justify-center gap-2 !bg-destructive">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
            {loading ? "Saindo..." : "Sair"}
          </button>
        </div>
      </div>
    </AuthCard>
  );
};

export default LogoutCard;
