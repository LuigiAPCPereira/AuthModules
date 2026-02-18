/**
 * Mensagens de erro específicas para melhorar UX
 * Cada erro tem uma mensagem clara e acionável
 */

export const AUTH_ERROR_MESSAGES = {
  // Login errors
  INVALID_CREDENTIALS: "E-mail ou senha incorretos. Verifique e tente novamente.",
  EMAIL_NOT_FOUND: "Nenhuma conta encontrada com este e-mail.",
  ACCOUNT_LOCKED: "Conta temporariamente bloqueada. Tente novamente em 15 minutos.",
  TOO_MANY_ATTEMPTS: "Muitas tentativas. Aguarde 5 minutos antes de tentar novamente.",

  // Signup errors
  EMAIL_ALREADY_EXISTS: "Já existe uma conta com este e-mail.",
  WEAK_PASSWORD: "Senha muito fraca. Use 8+ caracteres com maiúscula, minúscula, número e símbolo.",
  INVALID_EMAIL: "E-mail inválido. Verifique o endereço digitado.",
  NAME_REQUIRED: "Nome completo é obrigatório.",

  // Password reset errors
  INVALID_RESET_TOKEN: "Link de recuperação inválido ou expirado. Solicite uma nova recuperação.",
  TOKEN_EXPIRED: "Este link expirou. Solicite uma nova recuperação de senha.",

  // Email verification errors
  INVALID_VERIFICATION_CODE: "Código inválido. Verifique o código recebido.",
  CODE_EXPIRED: "Código expirado. Solicite um novo código.",
  TOO_MANY_VERIFICATION_ATTEMPTS: "Muitas tentativas. Aguarde 10 minutos.",

  // Network errors
  NETWORK_ERROR: "Erro de conexão. Verifique sua internet e tente novamente.",
  SERVER_UNAVAILABLE: "Servidor temporariamente indisponível. Tente novamente em instantes.",
  TIMEOUT: "A requisição demorou muito tempo. Tente novamente.",

  // Generic fallback
  UNKNOWN: "Ocorreu um erro inesperado. Tente novamente.",
} as const;

export const getAuthErrorMessage = (error: unknown): string => {
  // Error objects from API
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code: string }).code;
    if (code in AUTH_ERROR_MESSAGES) {
      return AUTH_ERROR_MESSAGES[code as keyof typeof AUTH_ERROR_MESSAGES];
    }
  }

  // Error instances
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // SECURITY: Check "not found" BEFORE "invalid" to prevent bypass
    // "invalid user not found" would match "invalid" first, leaking user info
    if (message.includes("not found") || message.includes("não encontrada")) {
      return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
    }
    if (message.includes("invalid") || message.includes("incorret")) {
      return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
    }
    // SECURITY: Map account status errors to generic login error
    // to prevent user enumeration (attacker can detect if account exists)
    if (message.includes("locked") || message.includes("bloqueada")) {
      return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
    }
    if (message.includes("too many") || message.includes("muitas tentativas")) {
      return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
    }
    if (message.includes("network") || message.includes("conexão")) {
      return AUTH_ERROR_MESSAGES.NETWORK_ERROR;
    }
    if (message.includes("timeout") || message.includes("tempo")) {
      return AUTH_ERROR_MESSAGES.TIMEOUT;
    }
  }

  // String errors
  if (typeof error === "string") {
    const lower = error.toLowerCase();
    // SECURITY: Return generic message to prevent signup enumeration
    // Attacker could detect if email is registered by checking error message
    if (lower.includes("já existe") || lower.includes("already")) {
      return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
    }
    if (lower.includes("inválido") || lower.includes("invalid")) {
      return AUTH_ERROR_MESSAGES.INVALID_EMAIL;
    }
  }

  // Fallback
  return AUTH_ERROR_MESSAGES.UNKNOWN;
};
