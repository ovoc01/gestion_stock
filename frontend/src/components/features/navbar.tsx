import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";

import Logo from "@/components/ui/logo"
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft, faChartSimple, faChevronDown, faDatabase, faPowerOff, faScaleBalanced, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { siteConfig } from "@/config/site";



export const Navbar = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user')
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }


  return (
    <NextUINavbar maxWidth="2xl" position="sticky" className="px-8">
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
            color="primary"

          >
            Dashboard
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Button
            startContent={
              <FontAwesomeIcon icon={faUsers} />
            }
            disableRipple
            className="p-0 bg-transparent data-[hover=true]:bg-transparent text-lg"
            radius="sm"
            variant="light"
            onClick={(e) => {
              e.preventDefault()
              navigate('/utilisateurs')
            }}
            color="primary"


          >
            Gérer les Utilisateurs
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
                  color="primary"
                >
                  Réferentiels
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu

              className="w-[160px]"
              itemClasses={{
                base: "gap-4",
              }}
              items={siteConfig.referentielsItems}

            >
              {
                (item) => (
                  <DropdownItem key={item.label} className="text-lg" startContent={<FontAwesomeIcon icon={item.icon!} />} onClick={(e) => {
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

                  endContent={
                    <FontAwesomeIcon icon={faChevronDown} />
                  }
                  color="primary"
                >
                  Mouvements
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="ACME features"
              className="w-[160px]"
              itemClasses={{
                base: "gap-4",
              }}
              items={siteConfig.mouvementsItems}
            >


              {
                (item) => (
                  <DropdownItem key={item.label} className="text-lg" startContent={<FontAwesomeIcon icon={item.icon!} />} onClick={(e) => {
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
                    <FontAwesomeIcon icon={faScaleBalanced} />
                  }
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent text-lg"
                  radius="sm"
                  variant="light"
                  endContent={
                    <FontAwesomeIcon icon={faChevronDown} />
                  }
                  color="primary"
                >
                  Stock
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="ACME features"
              className="w-[160px]"
              itemClasses={{
                base: "gap-4",
              }}
              items={siteConfig.stockItems}
            >

              {
                (item) => (
                  <DropdownItem isDisabled={item.isDibbled} key={item.label} className="text-lg" startContent={<FontAwesomeIcon icon={item.icon!} />} onClick={(e) => {
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


      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >


        <NavbarItem className="hidden sm:flex gap-2" >
          Bonjour 👋🏽  <h2 className="font-semibold text-lg">{userName}</h2>
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
            onClick={logout}
          >
            Se Déconnecter
          </Button>
        </NavbarItem>
      </NavbarContent>

    </NextUINavbar>
  );
};
