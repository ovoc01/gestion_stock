import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faChevronDown,
  faDatabase,
  faPowerOff,
  faScaleBalanced,
  faTruckMoving,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import Logo from "@/components/ui/logo";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

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

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  const changeActive = (url: string) => {
    return window.location.pathname.includes(url);
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
          "data-[active=true]:after:bottom-4",
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

        <NavbarItem isActive={changeActive("/dashboards")}>
          <Button
            disableRipple
            className="p-0 bg-transparent data-[hover=true]:bg-transparent text-sm transition hover:text"
            color="primary"
            radius="sm"
            startContent={<FontAwesomeIcon icon={faChartSimple} />}
            variant="light"
            onPress={() => handleNavigation("/dashboards")}
          >
            Dashboard
          </Button>
        </NavbarItem>

        {user?.role === "Administrateur" && (
          <NavbarItem isActive={changeActive("/utilisateurs")}>
            <Button
              disableRipple
              className="p-0 bg-transparent data-[hover=true]:bg-transparent text-sm"
              color="primary"
              radius="sm"
              startContent={<FontAwesomeIcon icon={faUsers} />}
              variant="light"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/utilisateurs");
              }}
            >
              Gérer les Utilisateurs
            </Button>
          </NavbarItem>
        )}

        <NavbarItem isActive={changeActive("/livraisons")}>
          <Button
            disableRipple
            className="p-0 bg-transparent data-[hover=true]:bg-transparent text-sm"
            color="primary"
            radius="sm"
            startContent={<FontAwesomeIcon icon={faTruckMoving} />}
            variant="light"
            onPress={() => handleNavigation("/livraisons")}
          >
            Livraison
          </Button>
        </NavbarItem>

        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent text-sm"
                color="primary"
                endContent={<FontAwesomeIcon icon={faChevronDown} />}
                radius="sm"
                startContent={<FontAwesomeIcon icon={faDatabase} />}
                variant="light"
              >
                Réferentiels
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu className="w-fit" itemClasses={{ base: "gap-4" }} items={siteConfig.referentielsItems}>
            {(item) => (
              <DropdownItem
                key={item.label}
                className="text-sm"
                startContent={<FontAwesomeIcon icon={item.icon!} />}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.href);
                }}
              >
                {item.label}
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent text-sm"
                color="primary"
                endContent={<FontAwesomeIcon icon={faChevronDown} />}
                radius="sm"
                startContent={<FontAwesomeIcon icon={faScaleBalanced} />}
                variant="light"
              >
                Stock
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu aria-label="ACME features" className="w-fit" itemClasses={{ base: "gap-4" }} items={siteConfig.stockItems}>
            {(item) => (
              <DropdownItem
                key={item.label}
                className="text-sm"
                isDisabled={item.isDibbled}
                startContent={<FontAwesomeIcon icon={item.icon!} />}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.href);
                }}
              >
                {item.label}
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
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
