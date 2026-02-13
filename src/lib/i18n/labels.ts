/**
 * Sistema de internacionalização (i18n) para a biblioteca de autenticação
 * Permite configurar todos os textos via props ou contexto
 */

export interface AuthLabels {
  // Login
  login: {
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    rememberMe: string;
    forgotPassword: string;
    submitButton: string;
    submitLoading: string;
    googleButton: string;
    noAccount: string;
    createAccount: string;
  };
  
  // Signup
  signup: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    submitButton: string;
    submitLoading: string;
    googleButton: string;
    hasAccount: string;
    login: string;
  };
  
  // Forgot Password
  forgotPassword: {
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    submitButton: string;
    submitLoading: string;
    backToLogin: string;
    successTitle: string;
    successSubtitle: string;
    successMessage: string;
  };
  
  // Reset Password
  resetPassword: {
    title: string;
    subtitle: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    submitButton: string;
    submitLoading: string;
    successTitle: string;
    successSubtitle: string;
    successMessage: string;
    goToLogin: string;
  };
  
  // Email Verification
  emailVerification: {
    title: string;
    subtitle: string;
    resendButton: string;
    resendLoading: string;
    backToLogin: string;
    changeEmail: string;
  };
  
  // Email Verified
  emailVerified: {
    title: string;
    subtitle: string;
    continueButton: string;
  };
  
  // Logout
  logout: {
    title: string;
    subtitle: string;
    confirmButton: string;
    confirmLoading: string;
    cancelButton: string;
  };
  
  // Password Strength
  passwordStrength: {
    veryWeak: string;
    weak: string;
    fair: string;
    good: string;
    strong: string;
    requirements: {
      minLength: string;
      uppercase: string;
      lowercase: string;
      number: string;
      special: string;
    };
  };
  
  // Trust Indicators
  trust: {
    ssl: string;
    secure: string;
  };
  
  // Common
  common: {
    or: string;
    loading: string;
  };
}

// Labels padrão em português
export const defaultLabelsPt: AuthLabels = {
  login: {
    title: "Entrar",
    subtitle: "Bem-vindo de volta. Faça login na sua conta.",
    emailLabel: "E-mail",
    emailPlaceholder: "seu@email.com",
    passwordLabel: "Senha",
    passwordPlaceholder: "••••••",
    rememberMe: "Lembrar de mim",
    forgotPassword: "Esqueceu a senha?",
    submitButton: "Entrar",
    submitLoading: "Entrando...",
    googleButton: "Continuar com Google",
    noAccount: "Não tem uma conta?",
    createAccount: "Criar conta",
  },
  signup: {
    title: "Criar conta",
    subtitle: "Preencha os dados abaixo para começar.",
    nameLabel: "Nome completo",
    namePlaceholder: "Seu nome",
    emailLabel: "E-mail",
    emailPlaceholder: "seu@email.com",
    passwordLabel: "Senha",
    passwordPlaceholder: "Mínimo 8 caracteres",
    submitButton: "Criar conta",
    submitLoading: "Criando...",
    googleButton: "Registrar com Google",
    hasAccount: "Já tem uma conta?",
    login: "Entrar",
  },
  forgotPassword: {
    title: "Esqueceu a senha?",
    subtitle: "Insira seu e-mail para receber o link de redefinição.",
    emailLabel: "E-mail",
    emailPlaceholder: "seu@email.com",
    submitButton: "Enviar link",
    submitLoading: "Enviando...",
    backToLogin: "Voltar ao login",
    successTitle: "E-mail enviado",
    successSubtitle: "Verifique sua caixa de entrada.",
    successMessage: "Enviamos um link de redefinição para {email}. Verifique também a pasta de spam.",
  },
  resetPassword: {
    title: "Redefinir senha",
    subtitle: "Escolha uma nova senha para sua conta.",
    passwordLabel: "Nova senha",
    passwordPlaceholder: "Mínimo 8 caracteres",
    submitButton: "Redefinir senha",
    submitLoading: "Redefinindo...",
    successTitle: "Senha redefinida",
    successSubtitle: "Sua senha foi alterada com sucesso.",
    successMessage: "Agora você pode fazer login com sua nova senha.",
    goToLogin: "Ir para o login",
  },
  emailVerification: {
    title: "Verificação de e-mail",
    subtitle: "Digite o código de 6 dígitos enviado para {email}.",
    resendButton: "Reenviar código",
    resendLoading: "Reenviando...",
    backToLogin: "Voltar ao login",
    changeEmail: "Alterar e-mail",
  },
  emailVerified: {
    title: "E-mail verificado!",
    subtitle: "Sua conta foi ativada com sucesso.",
    continueButton: "Continuar",
  },
  logout: {
    title: "Sair da conta",
    subtitle: "Tem certeza que deseja sair?",
    confirmButton: "Sair",
    confirmLoading: "Saindo...",
    cancelButton: "Cancelar",
  },
  passwordStrength: {
    veryWeak: "Muito fraca",
    weak: "Fraca",
    fair: "Razoável",
    good: "Boa",
    strong: "Forte",
    requirements: {
      minLength: "Mínimo 8 caracteres",
      uppercase: "Letra maiúscula",
      lowercase: "Letra minúscula",
      number: "Número",
      special: "Caractere especial",
    },
  },
  trust: {
    ssl: "Protegido com criptografia SSL de 256-bit",
    secure: "Seguro",
  },
  common: {
    or: "ou",
    loading: "Carregando...",
  },
};

// Labels em inglês
export const defaultLabelsEn: AuthLabels = {
  login: {
    title: "Sign in",
    subtitle: "Welcome back. Sign in to your account.",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    submitButton: "Sign in",
    submitLoading: "Signing in...",
    googleButton: "Continue with Google",
    noAccount: "Don't have an account?",
    createAccount: "Create account",
  },
  signup: {
    title: "Create account",
    subtitle: "Fill in the details below to get started.",
    nameLabel: "Full name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Minimum 8 characters",
    submitButton: "Create account",
    submitLoading: "Creating...",
    googleButton: "Sign up with Google",
    hasAccount: "Already have an account?",
    login: "Sign in",
  },
  forgotPassword: {
    title: "Forgot password?",
    subtitle: "Enter your email to receive the reset link.",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    submitButton: "Send link",
    submitLoading: "Sending...",
    backToLogin: "Back to sign in",
    successTitle: "Email sent",
    successSubtitle: "Check your inbox.",
    successMessage: "We sent a reset link to {email}. Check your spam folder too.",
  },
  resetPassword: {
    title: "Reset password",
    subtitle: "Choose a new password for your account.",
    passwordLabel: "New password",
    passwordPlaceholder: "Minimum 8 characters",
    submitButton: "Reset password",
    submitLoading: "Resetting...",
    successTitle: "Password reset",
    successSubtitle: "Your password has been changed successfully.",
    successMessage: "You can now sign in with your new password.",
    goToLogin: "Go to sign in",
  },
  emailVerification: {
    title: "Email verification",
    subtitle: "Enter the 6-digit code sent to {email}.",
    resendButton: "Resend code",
    resendLoading: "Resending...",
    backToLogin: "Back to sign in",
    changeEmail: "Change email",
  },
  emailVerified: {
    title: "Email verified!",
    subtitle: "Your account has been activated successfully.",
    continueButton: "Continue",
  },
  logout: {
    title: "Sign out",
    subtitle: "Are you sure you want to sign out?",
    confirmButton: "Sign out",
    confirmLoading: "Signing out...",
    cancelButton: "Cancel",
  },
  passwordStrength: {
    veryWeak: "Very weak",
    weak: "Weak",
    fair: "Fair",
    good: "Good",
    strong: "Strong",
    requirements: {
      minLength: "Minimum 8 characters",
      uppercase: "Uppercase letter",
      lowercase: "Lowercase letter",
      number: "Number",
      special: "Special character",
    },
  },
  trust: {
    ssl: "Protected with 256-bit SSL encryption",
    secure: "Secure",
  },
  common: {
    or: "or",
    loading: "Loading...",
  },
};
