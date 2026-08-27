import { createContext } from "react";

export type UserRole = "admin" | "talent" | "company" | null;

export type User = {
  id: string;
  email: string;
  role: UserRole;
  isPremium?: boolean;
  membershipTier?: "free" | "premium" | string;
};

interface AuthContextType {
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  finishProfile: () => void;
  authFetch: typeof fetch;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
