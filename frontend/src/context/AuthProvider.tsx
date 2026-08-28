import { useCallback, useEffect, useState, type ReactNode } from "react";
import useLocalStorageState from "use-local-storage-state";
import { AuthContext, type User, type UserRole } from "./AuthContext";
import {
  clearAllKnownSetupDraftsForUser,
  clearLegacySetupDrafts,
} from "../util/draftStorage";

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
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const loadIsProfileComplete = async () => {
      try {
        setIsInitialized(false);
        const response = await fetch("/api/is-profile-complete", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setIsProfileComplete(data.hasProfile);
        }
      } catch (err) {
        setIsProfileComplete(false);
        console.log(err);
      } finally {
        setIsInitialized(true);
      }
    };
    if (token) {
      loadIsProfileComplete();
    } else {
      setUser(null);
      setIsProfileComplete(false);
      setIsInitialized(true);
    }
  }, [token, setUser]);

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

      // Reset setup drafts after registration to avoid any stale local data.
      clearAllKnownSetupDraftsForUser(user?.id);

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
      // Remove legacy and scoped setup drafts on login so backend-seeded
      // profile data can hydrate without stale local draft interference.
      clearLegacySetupDrafts();
      clearAllKnownSetupDraftsForUser(user?.id);
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

  const finishProfile = () => {
    setIsProfileComplete(true);
  };

  const logout = () => {
    clearAllKnownSetupDraftsForUser(user?.id);
    setToken(null);
    setUser(null);
    setIsProfileComplete(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isProfileComplete,
        finishProfile,
        authFetch,
        login,
        signup,
        logout,
      }}
    >
      {isInitialized ? children : null}
    </AuthContext.Provider>
  );
}
