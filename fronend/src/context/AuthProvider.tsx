import { useEffect, useState } from "react";
import { AuthContext, User } from "@/types/authContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("auth");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (parsed?.token && parsed?.user) {
        setToken(parsed.token);
        setUser(parsed.user);
      }
    } catch {
      console.warn("Invalid auth in localStorage");
      localStorage.removeItem("auth");
    }
  }, []);

  const login = (token: string, user: User) => {
    setToken(token);
    setUser(user);

    localStorage.setItem(
      "auth",
      JSON.stringify({ token, user })
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
