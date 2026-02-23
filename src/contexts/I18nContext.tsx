/**
 * Contexto de internacionalização para a biblioteca de autenticação
 * Permite configurar labels em diferentes idiomas
 */

import { createContext, useContext, ReactNode } from "react";
import { AuthLabels, defaultLabelsPt } from "@/lib/i18n/labels";

interface I18nContextValue {
  labels: AuthLabels;
  locale: string;
}

const I18nContext = createContext<I18nContextValue>({
  labels: defaultLabelsPt,
  locale: "pt",
});

interface I18nProviderProps {
  children: ReactNode;
  labels?: AuthLabels;
  locale?: string;
}

export const I18nProvider = ({ 
  children, 
  labels = defaultLabelsPt,
  locale = "pt" 
}: I18nProviderProps) => {
  return (
    <I18nContext.Provider value={{ labels, locale }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n deve ser usado dentro de I18nProvider");
  }
  return context;
};
