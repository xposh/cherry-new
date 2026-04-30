/*Speichert:
- currentUser (Talent oder Company)
- role ("talent" oder "company")
- isAuthenticated (true/false)

Funktionen:
- login(user)
- logout() */

// Needs to be changed when backend is available

import { createContext, useContext, useState, type ReactNode } from "react";

export type UserRole = "worker" | "employer" | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  userId: string | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const login = (email: string, password: string, role: UserRole) => {
    // Mock login - in production this would call your backend
    console.log("Login:", { email, password, role });
    setIsAuthenticated(true);
    setUserRole(role);
    setUserId(`${role}-${Date.now()}`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
  };

  const setRole = (role: UserRole) => {
    setUserRole(role);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, userId, login, logout, setRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
