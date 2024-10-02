import { Link } from "@nextui-org/link";

import { Navbar } from "@/components/features/navbar";
import { Toaster } from 'sonner';
import { useAuth } from "@/hooks/useAuth";
import UserSessionExpired from "@/pages/error/user-session-expired";


export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const provider = useAuth()
  const isAuthenticated = provider.isAuthenticated


  return (
    <>

      <div className="relative flex flex-col h-screen w-full  ">
        <Navbar />
        <main className="container mx-auto w-full  flex-grow  ">
          {
            isAuthenticated ? (children) : (<UserSessionExpired />)
          }

        </main>
        <Toaster position="top-right" richColors />
        <footer className="w-full flex items-center justify-center py-3 bg-foreground" >
          <Link
            isExternal
            className="flex items-center gap-1 text-current"
            href="https://colas.com"
          >
            <span className="text-default-600">© Copyright</span>
            <p className="text-warning">Colas Madagascar 2024</p>
          </Link>
        </footer>
      </div>
    </>
  );
}
