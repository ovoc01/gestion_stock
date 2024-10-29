import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPowerOff
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import Logo from "@/components/ui/logo";
import { AdminNavbarItems, SimpleUserNavBar } from "@/config/site";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { NavbarItemsRenderer } from "./navbar-items-renderer";



export const Navbar = () => {
  const provider = useAuth();
  const user = provider.userClaims;
  const navigate = useNavigate();

  useEffect(() => {
    console.log('test');
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };



  return (
    <NextUINavbar
      className="bg-slate-20 container"
      maxWidth="full"
      position="sticky"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-2",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand>
          <div className="w-[100px]">
            <Logo height={40} logo="n-title" width={100} />
          </div>
        </NavbarBrand>
        <NavbarItemsRenderer navbarItems={AdminNavbarItems} />
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="sm:flex gap-2 flex items-center">
          Bonjour 👋🏽 <h2 className="font-semibold text-sm">{user?.username}</h2>
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
            as={Link}
            className="font-normal text-sm"
            color="danger"
            endContent={<FontAwesomeIcon icon={faPowerOff} />}
            size="lg"
            variant="flat"
            onClick={logout}
          >
            Se Déconnecter
          </Button>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};


