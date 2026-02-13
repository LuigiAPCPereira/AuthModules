/**
 * Hook customizado para validação inline com blur
 * Adiciona validação em blur para melhor UX
 */

import { useEffect, useState, useCallback } from "react";

interface ValidationRule {
  field: string;
  validate: (value: string) => boolean | string;
  error: string;
}

interface UseValidationOptions {
  rules: ValidationRule[];
  validateOnBlur?: boolean;
}

interface UseValidationReturn {
  errors: Record<string, string>;
  validateField: (field: string) => (e: React.FocusEvent) => void;
  clearError: (field: string) => void;
}

export const useValidation = ({
  rules,
  validateOnBlur = true,
}: UseValidationOptions): UseValidationReturn => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateField = useCallback((field: string) => (e: React.FocusEvent) => {
    const rule = rules.find((r) => r.field === field);
    if (!rule) return;

    const result = rule.validate((e.target as HTMLInputElement).value);
    if (result !== true) {
      setErrors((prev) => ({ ...prev, [field]: rule.error }));
    } else {
      clearError(field);
    }
  }, [rules]);

  useEffect(() => {
    if (validateOnBlur) {
      // Adicionar validação no blur
      const handlers: Record<string, (e: Event) => void> = {};

      Object.keys(errors).forEach((field) => {
        const element = document.getElementById(field) as HTMLInputElement;
        if (element) {
          // Cast React.FocusEvent handler to native Event handler for addEventListener
          const handler = (e: Event) => validateField(field)(e as unknown as React.FocusEvent);
          handlers[field] = handler;
          element.addEventListener("blur", handler);
        }
      });

      return () => {
        Object.keys(handlers).forEach((field) => {
          const element = document.getElementById(field) as HTMLInputElement;
          if (element) {
            element.removeEventListener("blur", handlers[field]);
          }
        });
      };
    }
  }, [errors, validateOnBlur, validateField]);

  return {
    errors,
    validateField,
    clearError,
  };
};
