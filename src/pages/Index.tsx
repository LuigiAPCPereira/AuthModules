import { useState, lazy, Suspense, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import ThemeToggle from "@/components/auth/ThemeToggle";

const SignupForm = lazy(() => import("@/components/auth/SignupForm"));
const ForgotPasswordForm = lazy(() => import("@/components/auth/ForgotPasswordForm"));
const ResetPasswordForm = lazy(() => import("@/components/auth/ResetPasswordForm"));
const EmailVerification = lazy(() => import("@/components/auth/EmailVerification"));
const EmailVerified = lazy(() => import("@/components/auth/EmailVerified"));
const LogoutCard = lazy(() => import("@/components/auth/LogoutCard"));

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

const LoadingFallback = () => (
  <div className="flex h-[400px] w-full items-center justify-center rounded-xl border bg-card text-card-foreground shadow">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const Index = () => {
  const [active, setActive] = useState<Screen>("login");

  const simulateAsync = () => new Promise<void>((r) => setTimeout(r, 1500));

  const handleScreenKeyNavigation = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = screens.indexOf(active);

    // A11y: seta horizontal permite trocar de formulário sem precisar usar mouse.
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setActive(screens[(currentIndex + 1) % screens.length]);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActive(screens[(currentIndex - 1 + screens.length) % screens.length]);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActive(screens[0]);
    }

    if (event.key === "End") {
      event.preventDefault();
      setActive(screens[screens.length - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <ThemeToggle />

      {/* Skip links */}
      <SkipLink href="#main-content" />

      {/* Auth Navigation Tabs */}
      <div
        role="tablist"
        aria-label="Navegação de telas de autenticação"
        onKeyDown={handleScreenKeyNavigation}
        className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto pt-8"
      >
          {screens.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              role="tab"
              aria-selected={active === s}
              aria-controls={`auth-screen-${s}`}
              id={`auth-tab-${s}`}
              tabIndex={active === s ? 0 : -1}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
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
            role="tabpanel"
            aria-labelledby={`auth-tab-${active}`}
            id={`auth-screen-${active}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md"
          >
            <Suspense fallback={<LoadingFallback />}>
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
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
