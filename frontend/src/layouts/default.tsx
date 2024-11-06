import { Link } from "@nextui-org/link";
import { Toaster } from "sonner";
import { Navbar } from "@/components/features/navbar";
import { useAuth } from "@/hooks/useAuth";
import UserSessionExpired from "@/pages/admin/error/user-session-expired";
import { useEffect, useState } from "react";
import { NavBarItems, SimpleUserNavBar } from "@/config/site";
import { NAVBAR_CONFIG } from "@/config/constant";
import { Spinner } from "@nextui-org/react";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userClaims, isVerificationDone } = useAuth();
  const [navbarItems, setNavbarItems] = useState<NavBarItems[]>(SimpleUserNavBar);

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
        <div className="flex items-center flex-col h-screen w-full">
          <Navbar navbarItems={navbarItems} />
          <main className="container mx-auto w-full flex-grow">
            {isAuthenticated ? children : <UserSessionExpired />}
          </main>
          <Toaster richColors position="top-right" />
          <footer className="w-full flex items-center justify-center py-3 bg-black">
            <Link
              isExternal
              className="flex items-center gap-1 text-current"
              href="https://colas.com"
            >
              <span className="text-default-400">© Tous droits réservées</span>
              <p className="text-warning">Colas Madagascar 2024</p>
            </Link>
          </footer>
        </div>
      )}
    </>
  );
}
