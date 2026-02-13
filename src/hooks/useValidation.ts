/**
 * Hook customizado para validação inline com blur
 * Adiciona validação em blur para melhor UX
 */

import { useCallback, useEffect, useState } from "react";

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

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const validateField = useCallback(
    (field: string) => (e: React.FocusEvent<HTMLInputElement>) => {
      const rule = rules.find((r) => r.field === field);
      if (!rule) return;

      const result = rule.validate(e.target.value);
      if (result !== true) {
        setErrors((prev) => ({ ...prev, [field]: rule.error }));
      } else {
        clearError(field);
      }
    },
    [rules, clearError],
  );

  useEffect(() => {
    if (validateOnBlur) {
      // Adicionar validação no blur
      Object.keys(errors).forEach((field) => {
        const element = document.getElementById(field) as HTMLInputElement;
        if (element) {
          element.addEventListener("blur", (e) => validateField(field)(e));
        }
      });
    }
    // Cleanup
    return () => {
      Object.keys(errors).forEach((field) => {
        const element = document.getElementById(field) as HTMLInputElement;
        if (element) {
          element.removeEventListener("blur", (e) => validateField(field)(e));
        }
      });
    };
  }, [rules, validateOnBlur, errors, validateField]);

  return {
    errors,
    validateField,
    clearError,
  };
};
