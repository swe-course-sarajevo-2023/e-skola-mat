"use client";
import { createContext, useState } from "react";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  authenticated: false,
  role: null,
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(true);
  const [role, setRole] = useState("student");

  return (
    <AuthContext.Provider value={{ user, authenticated, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
