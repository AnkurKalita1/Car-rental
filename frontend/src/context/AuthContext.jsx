import { createContext, useCallback, useMemo, useState } from "react";
import * as authApi from "../api/auth";

export const AuthContext = createContext(null);

const getStoredUser = () => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(localStorage.getItem("token"));

  const setAuth = useCallback((payload) => {
    setUser(payload.user);
    setToken(payload.token);
    localStorage.setItem("user", JSON.stringify(payload.user));
    localStorage.setItem("token", payload.token);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  const login = useCallback(async (values) => {
    const data = await authApi.login(values);
    setAuth(data);
    return data;
  }, [setAuth]);

  const register = useCallback(async (values) => {
    const data = await authApi.register(values);
    setAuth(data);
    return data;
  }, [setAuth]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isOwner: user?.role === "owner",
      login,
      register,
      logout: clearAuth
    }),
    [user, token, login, register, clearAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
