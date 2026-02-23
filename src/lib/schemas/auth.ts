/**
 * Schemas Zod centralizados para validação de formulários de autenticação
 * Garante consistência e type safety em todos os forms
 */

import { z } from "zod";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_UPPERCASE_REGEX,
  PASSWORD_LOWERCASE_REGEX,
  PASSWORD_NUMBER_REGEX,
  PASSWORD_SPECIAL_REGEX,
} from "../constants";

/**
 * Schema de Login (JÁ EXISTE em LoginForm, mantido para referência)
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: "E-mail é obrigatório" })
    .min(1, "E-mail é obrigatório")
    .max(255, "E-mail muito longo")
    .trim()
    .email("E-mail inválido"),
  password: z
    .string({ required_error: "Senha é obrigatória" })
    .min(1, "Senha é obrigatória")
    .min(6, "Mínimo de 6 caracteres")
    .max(100, "Senha muito longa"),
});

/**
 * Schema de Signup (SEM confirmar senha - quick win implementado)
 */
export const signupSchema = z.object({
  name: z
    .string({ required_error: "Nome é obrigatório" })
    .min(1, "Nome é obrigatório")
    .max(100, "Nome muito longo")
    .trim(),
  email: z
    .string({ required_error: "E-mail é obrigatório" })
    .min(1, "E-mail é obrigatório")
    .max(255, "E-mail muito longo")
    .trim()
    .email("E-mail inválido"),
  password: z
    .string({ required_error: "Senha é obrigatória" })
    .min(8, "Mínimo de 8 caracteres")
    .trim()
    .max(100, "Senha muito longa")
    .regex(/[A-Z]/, "Deve conter uma letra maiúscula")
    .regex(/[a-z]/, "Deve conter uma letra minúscula")
    .regex(/\d/, "Deve conter um número")
    .regex(/[^A-Za-z0-9]/, "Deve conter um símbolo (@#$%, etc.)"),
});

/**
 * Schema para esqueci senha
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "E-mail é obrigatório" })
    .min(1, "E-mail é obrigatório")
    .max(255, "E-mail muito longo")
    .trim()
    .email("E-mail inválido"),
});

/**
 * Schema para redefinir senha (SEM confirmar senha - quick win)
 */
export const resetPasswordSchema = z.object({
  password: z
    .string({ required_error: "Nova senha é obrigatória" })
    .min(8, "Mínimo de 8 caracteres")
    .trim()
    .max(100, "Senha muito longa")
    .regex(/[A-Z]/, "Deve conter uma letra maiúscula")
    .regex(/[a-z]/, "Deve conter uma letra minúscula")
    .regex(/\d/, "Deve conter um número")
    .regex(/[^A-Za-z0-9]/, "Deve conter um símbolo (@#$%, etc.)"),
});

// Tipos inferidos para uso nos formulários
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
