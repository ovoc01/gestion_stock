import { Link } from "@nextui-org/link";

import { Navbar } from "@/components/navbar";
import { Toaster } from 'sonner';
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen ">
      <Navbar />
      <main className="container mx-auto w-4/5 px-6 flex-grow  pt-16">
        {children}
      </main>
      <Toaster richColors/>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://colas.com"
          
        >
          <span className="text-default-600">© Copyright</span>
          <p className="text-warning">Colas Madagascar</p>
        </Link>
      </footer>
    </div>
  );
}
