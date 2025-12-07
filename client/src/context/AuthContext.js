// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user session on refresh or GitHub OAuth redirect
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("http://localhost:4000/user/me", {
          withCredentials: true,
        });
        setUser(res.data); // null if not logged in
      } catch (error) {
        console.error("Auth load error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // LOGIN (manual)
  const login = async (email, password) => {
    const res = await api.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );
    setUser(res.data.user);
  };

  // SIGNUP
  const signup = async (name, email, password) => {
    const res = await api.post(
      "/auth/signup",
      { name, email, password },
      { withCredentials: true }
    );
    setUser(res.data.user);
  };

  // LOGOUT
  const logout = async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};
