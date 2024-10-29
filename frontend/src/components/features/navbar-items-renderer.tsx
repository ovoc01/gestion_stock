import { NavBarItems } from "@/config/site";
import { faChevronDown, faArrowsLeftRight, faChargingStation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { NavbarItem } from "@nextui-org/navbar";
import { useNavigate } from "react-router-dom";

interface NavbarItemsRendererProps {
   navbarItems: NavBarItems[];
}

export const NavbarItemsRenderer: React.FC<NavbarItemsRendererProps> = ({ navbarItems }) => {
   if (!navbarItems) return null;
   const navigate = useNavigate();

   const handleNavigation = (href: string) => {
      navigate(href)
   }

   const changeActive = (href: string) => {
      return window.location.pathname === href;
   }

   const Render = ({ item }: { item: NavBarItems }) => {
      if (item.dropdownItems && item.dropdownItems.length > 0) {
         return (
            <Dropdown key={item.key}>
               <NavbarItem>
                  <DropdownTrigger>
                     <Button
                        disableRipple
                        className="p-0 bg-transparent data-[hover=true]:bg-transparent text-sm"
                        color="primary"
                        endContent={<FontAwesomeIcon icon={faChevronDown} />}
                        radius="sm"
                        startContent={<FontAwesomeIcon icon={item.icon!} />}
                        variant="light"
                     >
                        {item.label}
                     </Button>
                  </DropdownTrigger>
               </NavbarItem>
               <DropdownMenu className="w-fit" itemClasses={{ base: "gap-4" }} items={item.dropdownItems}>
                  {(dropdownItem) => (
                     <DropdownItem
                        key={dropdownItem.label}
                        className="text-sm"
                        isDisabled={dropdownItem.isDibbled}
                        startContent={<FontAwesomeIcon icon={dropdownItem.icon!} />}
                        onClick={(e) => {
                           e.preventDefault();
                           handleNavigation(dropdownItem.href);
                        }}


                     >
                        {dropdownItem.label}
                     </DropdownItem>
                  )}
               </DropdownMenu>
            </Dropdown>

         );

      }

      else {
         return (
            <NavbarItem key={item.key} isActive={changeActive(item.href)}>
               <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent text-sm transition hover:text"
                  color="primary"
                  radius="sm"
                  startContent={<FontAwesomeIcon icon={item.icon!} />}
                  variant="light"
                  onClick={() => handleNavigation(item.href)} // Adjust onClick to use 'onClick' for Button
               >
                  {item.label}
               </Button>
            </NavbarItem>
         )
      }
   }
   return <div className="w-full flex gap-7">
      {
         navbarItems.map((item) => <Render item={item} />)
      }
   </div>
}