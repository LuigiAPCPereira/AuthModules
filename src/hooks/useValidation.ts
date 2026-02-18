/**
 * Hook customizado para validação inline com blur
 * Adiciona validação em blur para melhor UX
 */

import { useState, useCallback, useRef } from "react";

interface ValidationRule {
  field: string;
  validate: (value: string) => boolean | string;
  error: string;
}

interface UseValidationOptions {
  rules: ValidationRule[];
}

interface UseValidationReturn {
  errors: Record<string, string>;
  validateField: (field: string, value: string) => boolean;
  clearError: (field: string) => void;
  getFieldProps: (field: string) => {
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  };
}

export const useValidation = ({
  rules,
}: UseValidationOptions): UseValidationReturn => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const rulesRef = useRef(rules);
  rulesRef.current = rules;

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const validateField = useCallback((field: string, value: string): boolean => {
    const rule = rulesRef.current.find((r) => r.field === field);
    if (!rule) return true;

    const result = rule.validate(value);
    if (result !== true) {
      setErrors((prev) => ({ ...prev, [field]: rule.error }));
      return false;
    }
    clearError(field);
    return true;
  }, [clearError]);

  const getFieldProps = useCallback(
    (field: string) => ({
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
        validateField(field, e.target.value);
      },
    }),
    [validateField]
  );

  return {
    errors,
    validateField,
    clearError,
    getFieldProps,
  };
};
