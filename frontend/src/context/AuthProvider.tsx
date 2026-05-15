import { useCallback, type ReactNode } from "react";
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
  const [user, setUser] = useLocalStorageState<User | null>("user", {
    defaultValue: null,
  });
  const [token, setToken] = useLocalStorageState<string | null>("token", {
    defaultValue: null,
  });

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
      setToken(accessToken);
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
      setToken(accessToken);
      setUser(user);
    } catch (err) {
      console.log(err);
      throw new Error("Login failed");
    }
  };

  const authFetch: typeof fetch = useCallback(
    (input, init) => {
      const headers = new Headers(init?.headers);
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return fetch(input, { ...init, headers });
    },
    [token],
  );

  const logout = () => {
    setToken(null);
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
