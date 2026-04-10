import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("sp_token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("sp_token"));
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (token) {
      axiosInstance
        .get("/me")
        .then((res) => {
          setUser(res.data.user);
          setIsAuthenticated(true);
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post("/login", { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem("sp_token", newToken);
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    return res.data;
  };

  const logout = async () => {
    try {
      if (token) await axiosInstance.post("/logout");
    } catch (_) {}
    localStorage.removeItem("sp_token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
