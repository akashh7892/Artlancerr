import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getToken, getUser, setToken, setUser, clearAuth } from "../services/api";
import { connectSocket, disconnectSocket } from "../socket";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => getUser());
  const [token, setTokenState] = useState(() => getToken());
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  const role = user?.role || null;

  useEffect(() => {
    const t = getToken();
    const u = getUser();
    setTokenState(t);
    setUserState(u);
    if (t && u) {
      connectSocket(t);
    } else {
      disconnectSocket();
    }
    setLoading(false);
  }, []);

  const login = useCallback((data) => {
    if (data?.token) setToken(data.token);
    if (data?.user) setUser(data.user);
    setTokenState(data?.token || getToken());
    setUserState(data?.user ?? getUser());
    if (data?.token) connectSocket(data.token);
  }, []);

  const logout = useCallback(async () => {
    disconnectSocket();
    clearAuth();
    setTokenState(null);
    setUserState(null);
  }, []);

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    role,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
