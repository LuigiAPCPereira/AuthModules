/**
 * Auth Modules - Biblioteca completa de componentes de autenticação
 * 
 * @example
 * ```tsx
 * import { AuthProvider, LoginForm, SignupForm } from '@LuigiAPCPereira/auth-modules';
 * import '@LuigiAPCPereira/auth-modules/styles';
 * 
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <LoginForm 
 *         onSubmit={async (data) => {
 *           // Lógica de login
 *         }}
 *       />
 *     </AuthProvider>
 *   );
 * }
 * ```
 */

// Componentes de formulário
export { default as LoginForm } from "./components/auth/LoginForm";
export { default as SignupForm } from "./components/auth/SignupForm";
export { default as ForgotPasswordForm } from "./components/auth/ForgotPasswordForm";
export { default as ResetPasswordForm } from "./components/auth/ResetPasswordForm";
export { default as EmailVerification } from "./components/auth/EmailVerification";
export { default as EmailVerified } from "./components/auth/EmailVerified";
export { default as LogoutCard } from "./components/auth/LogoutCard";

// Componentes base
export { default as AuthCard } from "./components/auth/AuthCard";
export { default as AuthInput } from "./components/auth/AuthInput";
export { default as PasswordStrengthBar } from "./components/auth/PasswordStrengthBar";
export { default as PasswordStrengthIndicator } from "./components/auth/PasswordStrengthIndicator";
export { default as GoogleSignInButton } from "./components/auth/GoogleSignInButton";
export { default as ThemeToggle } from "./components/auth/ThemeToggle";
export { default as SkipLink } from "./components/auth/SkipLink";

// Contextos
export { AuthProvider, AuthContext } from "./contexts/AuthContext";
export { I18nProvider, useI18n } from "./contexts/I18nContext";

// Hooks
export { useValidation } from "./hooks/useValidation";

// Schemas e tipos
export {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginFormData,
  type SignupFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
} from "./lib/schemas/auth";

// Mensagens de erro
export { getAuthErrorMessage, AUTH_ERROR_MESSAGES } from "./lib/errorMessages";

// Internacionalização
export {
  defaultLabelsPt,
  defaultLabelsEn,
  type AuthLabels
} from "./lib/i18n/labels";

// Utilitários
export { isValidEmail, isPasswordStrong } from "./lib/utils";
