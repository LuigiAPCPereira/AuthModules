import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
}

interface UserContextType {
  user: UserProfile;
  updateUser: (data: Partial<UserProfile>) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const defaultUser: UserProfile = {
  name: "João Silva",
  email: "joao@email.com",
  phone: "(11) 99999-9999",
  avatar: null,
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const updateUser = useCallback((data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, isAuthenticated, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
