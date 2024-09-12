import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";

import Logo from "@/components/logo"
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faChevronDown, faDatabase, faLayerGroup, faMapLocationDot, faNewspaper, faPowerOff, faRuler, faWarehouse } from "@fortawesome/free-solid-svg-icons";

export const Navbar = () => {

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <Logo height={30} width={90} logo="n-title" className="mx-auto" />
          </Link>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                startContent = {
                  <FontAwesomeIcon icon={faDatabase}/>
                }
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                  radius="sm"
                  variant="light"
                  endContent={
                    <FontAwesomeIcon icon={faChevronDown} />
                  }
                >
                  Réferentiels
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="ACME features"
              className="w-[150px]"
              itemClasses={{
                base: "gap-4",
              }}
            >

              
              <DropdownItem key="autoscaling"  startContent={<FontAwesomeIcon icon={faBuilding}/>}>
                Unité operationnel
              </DropdownItem>
              
              <DropdownItem key="autoscaling"  startContent={<FontAwesomeIcon icon={faWarehouse}/>}>
                Magasin
              </DropdownItem>
              <DropdownItem key="autoscaling"  startContent={<FontAwesomeIcon icon={faMapLocationDot}/>}>
                Emplacment
              </DropdownItem>
              <DropdownItem key="autoscaling"  startContent={<FontAwesomeIcon icon={faLayerGroup}/>}>
                Famille
              </DropdownItem>
              <DropdownItem key="autoscaling"  startContent={<FontAwesomeIcon icon={faLayerGroup}/>}>
                Sous Famille
              </DropdownItem>

              <DropdownItem key="autoscaling"  startContent={<FontAwesomeIcon icon={faNewspaper}/>}>
                Article
              </DropdownItem>

              <DropdownItem key="autoscaling"  startContent={<FontAwesomeIcon icon={faRuler}/>}>
                Unité 
              </DropdownItem>

            </DropdownMenu>
          </Dropdown>
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2" >
          Bonjour 👋🏽  Mirindra RAZAFINDRASOAVA
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            endContent={
              <FontAwesomeIcon icon={faPowerOff} />
            }
            variant="flat"
          >
            Se Déconnecter
          </Button>
        </NavbarItem>
      </NavbarContent>

    </NextUINavbar>
  );
};
