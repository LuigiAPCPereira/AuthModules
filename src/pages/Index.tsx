import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import EmailVerification from "@/components/auth/EmailVerification";
import EmailVerified from "@/components/auth/EmailVerified";
import LogoutCard from "@/components/auth/LogoutCard";
import ThemeToggle from "@/components/auth/ThemeToggle";

type Screen =
  | "login"
  | "signup"
  | "forgot"
  | "reset"
  | "verify"
  | "verified"
  | "logout";

const screenLabels: Record<Screen, string> = {
  login: "Login",
  signup: "Registro",
  forgot: "Esqueci a Senha",
  reset: "Redefinir Senha",
  verify: "Verificação",
  verified: "Verificado",
  logout: "Logout",
};

const screens: Screen[] = ["login", "signup", "forgot", "reset", "verify", "verified", "logout"];

const Index = () => {
  const [active, setActive] = useState<Screen>("login");

  const simulateAsync = () => new Promise<void>((r) => setTimeout(r, 1500));

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <ThemeToggle />

      {/* Nav pills */}
      <div className="pt-8 pb-4 px-4">
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          {screens.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                active === s
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {active === s && (
                <motion.span
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{screenLabels[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Component display */}
      <div className="flex items-center justify-center px-4 py-12 sm:py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md"
          >
            {active === "login" && (
              <LoginForm
                onSubmit={simulateAsync}
                onForgotPassword={() => setActive("forgot")}
                onSignup={() => setActive("signup")}
                onGoogleSignIn={simulateAsync}
              />
            )}
            {active === "signup" && (
              <SignupForm
                onSubmit={simulateAsync}
                onLogin={() => setActive("login")}
                onGoogleSignIn={simulateAsync}
              />
            )}
            {active === "forgot" && (
              <ForgotPasswordForm
                onSubmit={simulateAsync}
                onBack={() => setActive("login")}
              />
            )}
            {active === "reset" && (
              <ResetPasswordForm
                onSubmit={simulateAsync}
                onLogin={() => setActive("login")}
              />
            )}
            {active === "verify" && (
              <EmailVerification
                email="demo@email.com"
                onVerify={simulateAsync}
                onResend={simulateAsync}
                onBack={() => setActive("login")}
              />
            )}
            {active === "verified" && (
              <EmailVerified onContinue={() => setActive("login")} />
            )}
            {active === "logout" && (
              <LogoutCard
                userName="João Silva"
                userEmail="joao@email.com"
                onLogout={simulateAsync}
                onCancel={() => setActive("login")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
