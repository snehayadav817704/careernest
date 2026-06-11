import { createContext, useContext, useMemo, useState } from "react";
import { roles } from "../utils/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("careernest_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = ({ role = roles.candidate, name = "Alex Rivera", email = "alex@careernest.com" } = {}) => {
    const nextUser = { name, email, role };
    localStorage.setItem("careernest_user", JSON.stringify(nextUser));
    localStorage.setItem("careernest_token", "demo-token");
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    localStorage.removeItem("careernest_user");
    localStorage.removeItem("careernest_token");
    setUser(null);
  };

  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
