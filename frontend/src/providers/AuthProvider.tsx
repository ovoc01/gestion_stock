import { createContext, useEffect, useState } from "react";

import {
  buildUserClaims,
  checkUserSessionValidity,
} from "@/services/api/auth.service";
import { UserClaims } from "@/types/types";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  userClaims?: UserClaims;
}
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userClaims, setUserClaims] = useState<UserClaims>();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const isTokenExpired = await checkUserSessionValidity(token!);

        setIsAuthenticated(!isTokenExpired);
        setUserClaims(buildUserClaims(token));
      } else {
        throw new Error("No token found");
      }
    };

    checkAuthentication();
  }, []); // Empty dependency array - run only once

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, userClaims }}
    >
      {children}
    </AuthContext.Provider>
  );
};
