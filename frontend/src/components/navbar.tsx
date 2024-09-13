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
import { faArrowRightArrowLeft, faCalendarCheck, faChartSimple, faChevronDown, faCube, faDatabase, faLayerGroup, faMapLocationDot, faNewspaper, faPowerOff, faRuler, faWarehouse, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { siteConfig } from "@/config/site";



export const Navbar = () => {
  const navigate = useNavigate();


  return (
    <NextUINavbar  maxWidth="2xl" position="sticky" className="px-8">
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
        <NavbarItem>
          <Button
            startContent={
              <FontAwesomeIcon icon={faChartSimple} />
            }
            disableRipple
            className="p-0 bg-transparent data-[hover=true]:bg-transparent text-lg"
            radius="sm"
            variant="light"
            isDisabled

          >
            Dashboard
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Button
            startContent={
              <FontAwesomeIcon icon={faCalendarCheck} />
            }
            disableRipple
            className="p-0 bg-transparent data-[hover=true]:bg-transparent text-lg"
            radius="sm"
            variant="light"


          >
            Périodes
          </Button>
        </NavbarItem>

        <div className="hidden lg:flex gap-4 justify-start ml-2">
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  startContent={
                    <FontAwesomeIcon icon={faDatabase} />
                  }
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent text-lg"
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
              
              className="w-[150px]"
              itemClasses={{
                base: "gap-4",
              }}
              items={siteConfig.referentielsItems}
            >
              {
                (item)=>(
                  <DropdownItem key={item.label} className="text-lg"  startContent={<FontAwesomeIcon icon={item.icon!}/>} onClick={(e)=>{
                    e.preventDefault()
                    navigate(item.href)
                  }}>
                    {item.label}
                  </DropdownItem>
                )
              }
              


            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="hidden lg:flex gap-4 justify-start ml-2">
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  startContent={
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} />
                  }
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent text-lg"
                  radius="sm"
                  variant="light"
                  isDisabled
                  endContent={
                    <FontAwesomeIcon icon={faChevronDown} />
                  }
                >
                  Mouvements
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


              <DropdownItem key="autoscaling" >
                Entrée
              </DropdownItem>

              <DropdownItem key="autoscaling" >
                Sortie
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
          Bonjour 👋🏽  <h2 className="font-semibold text-lg">Mirindra RAZAFINDRASOAVA</h2>
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button

            color="danger"
            as={Link}
            size="lg"
            className="text-sm font-normal text-lg"
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
