import { m, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { Shield, Lock } from "lucide-react";

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AuthCard = ({ children, title, subtitle }: AuthCardProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="auth-card"
    >
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-auth-subtle">{subtitle}</p>
        )}
        <div className="mt-6 flex items-center justify-center gap-3 text-xs text-auth-subtle">
          <Shield size={14} className="text-green-600 dark:text-green-400" aria-hidden="true" />
          <span className="flex items-center gap-1">
            <Lock size={12} className="text-muted-foreground" aria-hidden="true" />
            <span>Protegido com criptografia SSL de 256-bit</span>
          </span>
        </div>
      </div>
      {children}
    </m.div>
  );
};

export default AuthCard;
