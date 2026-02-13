import { describe, it, expect } from "vitest";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "../auth";

describe("Schemas de Validação", () => {
  describe("loginSchema", () => {
    it("aceita dados válidos", () => {
      const result = loginSchema.safeParse({
        email: "teste@email.com",
        password: "senha123", // ggignore
      });

      expect(result.success).toBe(true);
    });

    it("rejeita e-mail inválido", () => {
      const result = loginSchema.safeParse({
        email: "email-invalido",
        password: "senha123", // ggignore
      });

      expect(result.success).toBe(false);
    });

    it("rejeita senha curta", () => {
      const result = loginSchema.safeParse({
        email: "teste@email.com",
        password: "12345", // ggignore
      });

      expect(result.success).toBe(false);
    });
  });

  describe("signupSchema", () => {
    it("aceita dados válidos", () => {
      const result = signupSchema.safeParse({
        name: "João Silva",
        email: "joao@email.com",
        password: "TestPassword123!", // ggignore
      });

      expect(result.success).toBe(true);
    });

    it("NÃO requer campo confirmPassword (quick win implementado)", () => {
      const result = signupSchema.safeParse({
        name: "João Silva",
        email: "joao@email.com",
        password: "TestPassword123!", // ggignore
      });

      expect(result.success).toBe(true);
      // Verifica que o schema não tem confirmPassword
      const shape = signupSchema.shape;
      expect(shape).not.toHaveProperty("confirmPassword");
    });

    it("rejeita senha fraca", () => {
      const result = signupSchema.safeParse({
        name: "João Silva",
        email: "joao@email.com",
        password: "12345678", // ggignore
      });

      expect(result.success).toBe(false);
    });

    it("rejeita nome vazio", () => {
      const result = signupSchema.safeParse({
        name: "",
        email: "joao@email.com",
        password: "TestPassword123!", // ggignore
      });

      expect(result.success).toBe(false);
    });
  });

  describe("forgotPasswordSchema", () => {
    it("aceita e-mail válido", () => {
      const result = forgotPasswordSchema.safeParse({
        email: "teste@email.com",
      });

      expect(result.success).toBe(true);
    });

    it("rejeita e-mail inválido", () => {
      const result = forgotPasswordSchema.safeParse({
        email: "email-invalido",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("resetPasswordSchema", () => {
    it("NÃO requer confirmPassword (quick win)", () => {
      const result = resetPasswordSchema.safeParse({
        password: "NewTestPassword123!", // ggignore
      });

      expect(result.success).toBe(true);
      // Verifica que o schema não tem confirmPassword
      const shape = resetPasswordSchema.shape;
      expect(shape).not.toHaveProperty("confirmPassword");
    });
  });
});
