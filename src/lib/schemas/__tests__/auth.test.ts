import { describe, it, expect } from "vitest";
import { 
  loginSchema, 
  signupSchema, 
  forgotPasswordSchema,
  resetPasswordSchema 
} from "@/lib/schemas/auth";

describe("Schemas de Validação", () => {
  describe("loginSchema", () => {
    it("aceita dados válidos", () => {
      const result = loginSchema.safeParse({
        email: "teste@email.com",
        password: "TestPassword123!", // ggignore
      });
      
      expect(result.success).toBe(true);
    });

    it("rejeita e-mail inválido", () => {
      const result = loginSchema.safeParse({
        email: "email-invalido",
        password: "TestPassword123!", // ggignore
      });
      
      expect(result.success).toBe(false);
    });

    it("rejeita senha curta", () => {
      const result = loginSchema.safeParse({
        email: "teste@email.com",
        password: "123", // ggignore
      });

      expect(result.success).toBe(false);
    });

    it("rejeita e-mail muito longo", () => {
      const result = loginSchema.safeParse({
        email: "a".repeat(256) + "@email.com",
        password: "TestPassword123!", // ggignore
      });

      expect(result.success).toBe(false);
    });

    it("rejeita senha muito longa", () => {
      const result = loginSchema.safeParse({
        email: "teste@email.com",
        password: "a".repeat(101),
      });

      expect(result.success).toBe(false);
    });

    it("rejeita inputs excessivamente longos", () => {
      const result = loginSchema.safeParse({
        email: "a".repeat(256) + "@email.com",
        password: "a".repeat(101),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toContain("E-mail muito longo");
        expect(result.error.flatten().fieldErrors.password).toContain("Senha muito longa");
      }
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
        password: "weak", // ggignore
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

    it("rejeita nome muito longo", () => {
      const result = signupSchema.safeParse({
        name: "a".repeat(101),
        email: "joao@email.com",
        password: "TestPassword123!", // ggignore
      });

      expect(result.success).toBe(false);
    });

    it("rejeita nome excessivamente longo", () => {
      const result = signupSchema.safeParse({
        name: "a".repeat(101),
        email: "joao@email.com",
        password: "TestPassword123!", // ggignore
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toContain("Nome muito longo");
      }
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
        password: "TestPassword123!", // ggignore
      });
      
      expect(result.success).toBe(true);
      // Verifica que o schema não tem confirmPassword
      const shape = resetPasswordSchema.shape;
      expect(shape).not.toHaveProperty("confirmPassword");
    });
  });
});
