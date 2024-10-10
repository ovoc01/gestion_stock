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
import { useAuth } from "@/hooks/useAuth";



export const Navbar = () => {
  const provider = useAuth()
  const user = provider.userClaims
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token')
    //localStorage.removeItem('user')
    navigate('/')
  }
  return (
    <NextUINavbar className="bg-slate-20 container" position="sticky" maxWidth="full">

      <NavbarContent className="basis-1/5 sm:basis-full" justify="start"  >
        <NavbarBrand>
          <div className="w-[100px]">
            <Logo height={40} width={100} logo="n-title" />
          </div>
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

            color="primary"
            onPress={() => {

              navigate('/dashboards')
            }}
          >
            Dashboard
          </Button>
        </NavbarItem>

        {
          user?.role === 'Administrateur' ? (<NavbarItem>
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
          </NavbarItem>) : ('')
        }

        <div >
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

        <div >
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

        <div>
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
        className="hidden sm:flex basis-1/5 sm:basis-full "
        justify="end"
      >

        <NavbarItem className=" sm:flex gap-2 flex items-center " >
          Bonjour 👋🏽  <h2 className="font-semibold text-lg">{user?.username}</h2>
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button

            color="danger"
            as={Link}
            size="lg"
            className="font-normal text-lg"
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
