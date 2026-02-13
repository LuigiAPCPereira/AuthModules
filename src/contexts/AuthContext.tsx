/**
 * Contexto de autenticação com estados e ações
 * Gerencia usuário, sessão e métodos de autenticação
 */

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, isAuthenticated: false }));
    try {
      // Simular login - substituir por chamada real à API
      await new Promise((resolve) => setTimeout(() => resolve(), 1000));
      setState((prev) => ({
        ...prev,
        user: { id: "1", name: "João Silva", email },
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false, isAuthenticated: false }));
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await new Promise((resolve) => setTimeout(() => resolve(), 1000));
      setState((prev) => ({
        ...prev,
        user: { id: "2", name: "João Silva", email },
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await new Promise((resolve) => setTimeout(() => resolve(), 500));
      setState({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
