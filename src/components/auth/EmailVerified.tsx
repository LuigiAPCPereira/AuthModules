import { CheckCircle } from "lucide-react";
import { m as motion } from "framer-motion";
import AuthCard from "./AuthCard";

interface EmailVerifiedProps {
  onContinue?: () => void;
}

const EmailVerified = ({ onContinue }: EmailVerifiedProps) => {
  return (
    <AuthCard title="E-mail verificado!" subtitle="Sua conta foi verificada com sucesso.">
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="auth-success-icon !w-20 !h-20"
        >
          <CheckCircle size={36} />
        </motion.div>
        <p className="text-sm text-auth-subtle">
          Tudo pronto! Agora você pode acessar todos os recursos da plataforma.
        </p>
        <button type="button" onClick={onContinue} className="auth-btn-primary">
          Continuar
        </button>
      </div>
    </AuthCard>
  );
};

export default EmailVerified;
