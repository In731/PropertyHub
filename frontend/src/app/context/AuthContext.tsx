import { createContext, useContext, useState, ReactNode } from "react";
import { authApi, tokenStore, AuthUser } from "../lib/api";

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: AuthUser) => void;
  isAuthenticated: boolean;
}

const USER_KEY = "ph_current_user";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { token, user: u } = await authApi.signup(name, email, password);
      tokenStore.set(token);
      persist(u);
      return true;
    } catch (e: any) {
      alert(e?.message ?? "Signup failed");
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { token, user: u } = await authApi.login(email, password);
      tokenStore.set(token);
      persist(u);
      return true;
    } catch (e: any) {
      alert(e?.message ?? "Invalid email or password");
      return false;
    }
  };

  const logout = () => {
    tokenStore.clear();
    persist(null);
  };

  const updateUser = (updatedUser: AuthUser) => {
    persist(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
