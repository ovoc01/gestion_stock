import { Navigation } from "react-minimal-side-navigation";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "awesome-react-icons";
import { useState } from "react";

import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../ui/logo";
import { AdminNavbarItems } from "@/config/site";
import './sidebar.css'
export const Sidebar = () => {
   //const history = useHistory();
   const location = useLocation();
   const navigate = useNavigate();
   const [isSidebarOpen] = useState(true);
   const navigationItems = AdminNavbarItems.map(item => ({
      title: item.label,
      itemId: item.href || item.key, // Use href if available, otherwise fall back to key
      elemBefore: () => item.icon ? <FontAwesomeIcon icon={item.icon} /> : null,
      subNav: item.dropdownItems ? item.dropdownItems.map(subItem => ({
         title: subItem.label,
         itemId: subItem.href,
         elemBefore: () => subItem.icon ? <FontAwesomeIcon icon={subItem.icon} /> : undefined,
      })) : undefined,
   }));

   const changeLocation = (href: string) => {
      if (!href.includes("empty")) navigate(href)
   }

   const isActivePath = (itemId: string, pathname: string) => {
      return pathname.startsWith(itemId);
   };

   return (
      <>




         {/* Sidebar */}
         <div
            className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform 
               translate-x-0 bg-white border-r-2 lg:translate-x-0 lg:static lg:inset-0 
               ${isSidebarOpen ? "ease-out translate-x-0" : "ease-in -translate-x-full"
               }`}
         >
            <div className="flex items-center justify-center mt-3 text-center py-6">
               <span className="mx-2 text-2xl font-semibold text-black">
                  <Logo height={60} logo="n-title" width={150} />
               </span>
            </div>
            <div className="text-sm ">
               <Navigation
                  activeItemId={navigationItems.find(item => isActivePath(item.itemId, location.pathname))?.itemId || ''}
                  onSelect={({ itemId }) => {
                     changeLocation(itemId)
                  }}
                  items={navigationItems}
               />
            </div>

            <div className="absolute bottom-0 w-full my-8">
               <Navigation

                  activeItemId={location.pathname}
                  items={[
                     {
                        title: "Settings",
                        itemId: "/settings",
                        elemBefore: () => <Icon name="activity" />
                     }
                  ]}
                  onSelect={({ }) => {

                  }}
               />
               <Navigation
                  activeItemId={location.pathname}
                  items={[
                     {
                        title: "Se déconnecter",
                        itemId: "/logout",
                        elemBefore: () => <Icon name="power" />
                     }
                  ]}
                  onSelect={({ }) => {
                  }}
               />
            </div>
         </div>
      </>
   );
};
