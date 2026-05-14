import { createContext } from "react";

export type UserRole = "worker" | "employer" | null;

export type User = {
  id: string;
  email: string;
  role: UserRole;
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  authFetch: typeof fetch;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
