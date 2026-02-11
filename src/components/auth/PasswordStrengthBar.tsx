import { useMemo } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { PASSWORD_RULES } from "@/lib/utils";

interface PasswordStrengthBarProps {
  password: string;
}

const strengthConfig = [
  { label: "Muito fraca", color: "hsl(var(--destructive))" },
  { label: "Fraca", color: "hsl(0, 72%, 60%)" },
  { label: "Razoável", color: "hsl(var(--warning))" },
  { label: "Boa", color: "hsl(142, 71%, 55%)" },
  { label: "Forte", color: "hsl(var(--success))" },
];

const PasswordStrengthBar = ({ password }: PasswordStrengthBarProps) => {
  const passed = useMemo(() => PASSWORD_RULES.map((r) => r.test(password)), [password]);
  const score = passed.filter(Boolean).length;

  if (!password) return null;

  const config = strengthConfig[Math.max(0, score - 1)];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-3"
    >
      {/* Bar */}
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-colors duration-300"
            style={{
              backgroundColor: i < score ? config.color : "hsl(var(--border))",
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium transition-colors duration-300"
          style={{ color: config.color }}
        >
          {config.label}
        </span>
        <span className="text-xs text-auth-subtle">{score}/5</span>
      </div>

      {/* Rules checklist */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {PASSWORD_RULES.map((rule, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {passed[i] ? (
              <Check size={12} className="text-[hsl(var(--success))] shrink-0" />
            ) : (
              <X size={12} className="text-auth-subtle shrink-0" />
            )}
            <span
              className={`text-xs transition-colors duration-200 ${
                passed[i] ? "text-foreground" : "text-auth-subtle"
              }`}
            >
              {rule.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PasswordStrengthBar;
