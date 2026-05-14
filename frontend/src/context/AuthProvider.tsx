import { useCallback, useRef, useState, type ReactNode } from "react";
import useLocalStorageState from "use-local-storage-state";
import { AuthContext, type User, type UserRole } from "./AuthContext";

/*Speichert:
- currentUser (Talent oder Company)
- role ("talent" oder "company")
- isAuthenticated (true/false)

Funktionen:
- login(user)
- logout() */

// Needs to be changed when backend is available

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorageState<User | null>("auth", {
    defaultValue: null,
  });
  const accessTokenRef = useRef<string | null>(null);

  const signup = async (email: string, password: string, role: UserRole) => {
    console.log(email, password, role);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      if (!response.ok) {
        throw new Error(
          (await response.json()).message ?? "Registration failed",
        );
      }
      const { user, accessToken } = await response.json();
      accessTokenRef.current = accessToken;
      setUser(user);
    } catch (err) {
      console.log(err);
      throw new Error("Registration failed");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error((await response.json()).message ?? "Login failed");
      }
      const { user, accessToken } = await response.json();
      accessTokenRef.current = accessToken;
      setUser(user);
    } catch (err) {
      console.log(err);
      throw new Error("Login failed");
    }
  };

  const authFetch: typeof fetch = useCallback((input, init) => {
    const headers = new Headers(init?.headers);
    if (accessTokenRef.current)
      headers.set("Authorization", `Bearer ${accessTokenRef.current}`);
    return fetch(input, { ...init, headers });
  }, []);

  const logout = () => {
    accessTokenRef.current = null;
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        authFetch,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
