import { checkUserSessionValidity } from "@/services/api/auth.service";
import { createContext, useEffect, useState } from "react";

interface AuthContextType {
   isAuthenticated: boolean;
   setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
   
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   useEffect(() => {
      const checkAuthentication = async () => {
         const token = localStorage.getItem('token');
         if (token) {
            await checkUserSessionValidity()
            .then(() => {
               setIsAuthenticated(true)
            }).catch((error)=>{
               if(error.response){
                  if(error.response.status === 403){
                     setIsAuthenticated(false)
                  }
               }
            });
         } else {
            throw new Error("No token found");
         }
      };

      checkAuthentication();
   }, []); // Empty dependency array - run only once

   return (
      <AuthContext.Provider value={{ isAuthenticated,setIsAuthenticated }}>
         {children}
      </AuthContext.Provider>
   );
};