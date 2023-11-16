"use client";
import { createContext, useState } from "react";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  authenticated: false,
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ user, authenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
