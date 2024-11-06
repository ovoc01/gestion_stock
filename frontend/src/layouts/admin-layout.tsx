
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { NavBarItems, SimpleUserNavBar } from "@/config/site";
import { NAVBAR_CONFIG } from "@/config/constant";
import { Spinner } from "@nextui-org/react";
import { Sidebar } from "@/components/features/sidebar";
import UserSessionExpired from "@/pages/admin/error/user-session-expired";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
   const { isAuthenticated, userClaims, isVerificationDone } = useAuth();
   children
   const [navbarItems, setNavbarItems] = useState<NavBarItems[]>(SimpleUserNavBar);
   navbarItems
   useEffect(() => {
      if (isAuthenticated && userClaims) {
         setNavbarItems(NAVBAR_CONFIG.get(userClaims.role!)!);
      }
   }, [isAuthenticated, userClaims]);

   return (
      <>
         {!isVerificationDone ? (
            <div className="flex items-center justify-center h-screen w-full">
               <Spinner />
            </div>
         ) : (
            <div className="flex  h-screen w-full">

               <Sidebar />

               <main className="flex-grow overflow-y-auto container mx-auto h-screen p-4">
                  <div className="bg-white rounded-lg  p-6">
                     {isAuthenticated ? <Outlet /> : <UserSessionExpired />}

                     <Toaster position="top-right" richColors />
                  </div>
               </main>


            </div>
         )}
      </>
   );
}
