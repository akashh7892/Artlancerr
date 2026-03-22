import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  authAPI,
  getToken,
  getUser,
  setToken,
  setUser,
  clearAuth,
} from "../services/api";
import { connectSocket, disconnectSocket } from "../socket";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => getUser());
  const [token, setTokenState] = useState(() => getToken());
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  const role = user?.role || null;

  useEffect(() => {
    let m = true;
    const init = async () => {
      const t = getToken();
      if (!t) {
        setTokenState(null);
        setUserState(null);
        disconnectSocket();
        if (m) setLoading(false);
        return;
      }
      try {
        const me = await authAPI.getCurrentUser();
        if (!m) return;
        const resolvedUser = me?.user || me || getUser();
        setTokenState(t);
        setUserState(resolvedUser);
        setUser(resolvedUser);
        connectSocket(t);
      } catch {
        if (!m) return;
        clearAuth();
        setTokenState(null);
        setUserState(null);
        disconnectSocket();
      } finally {
        if (m) setLoading(false);
      }
    };
    init();
    return () => {
      m = false;
    };
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
