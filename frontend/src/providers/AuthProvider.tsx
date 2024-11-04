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
  isVerificationDone: boolean
}
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userClaims, setUserClaims] = useState<UserClaims>();
  const [isVerificationDone, setIsVerificationDone] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("token");
      try {
        if (token) {
          console.log(token)
          const isTokenExpired = checkUserSessionValidity(token!)
          console.log("custom hooks", !isTokenExpired)
          setIsAuthenticated(!isTokenExpired);
          setUserClaims(buildUserClaims(token));
        } else {
          throw new Error("No token found");
        }
      } catch (e) {

      } finally {
        setIsVerificationDone(true)
      }

    };

    checkAuthentication();
  }, []); // Empty dependency array - run only once

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, userClaims, isVerificationDone }}
    >
      {children}
    </AuthContext.Provider>
  );
};
