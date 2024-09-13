import {  faBuilding, faBuildingShield, faCube, faLayerGroup, faMapLocationDot, faNewspaper, faRuler, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { CSDropdownItemProps } from "@/types/types";
export type SiteConfig = typeof siteConfig;

const referentielsItems: CSDropdownItemProps[] = [
  {
      label:'Service Exploitant',
      href:'/referentiels/service-exploitants',
      icon:faBuildingShield
  },
  {
    'label': 'Unité operationnel',
    'href': '/referentiels/unite-operationnels',
    'icon': faBuilding
  },
  {
    'label': 'Magasin',
    'href': '/referentiels/magasins',
    'icon': faWarehouse
  },
  {
    'label': 'Emplacement',
    'href': '/referentiels/emplacements',
    'icon': faMapLocationDot
  },
  {
    'label': 'Famille',
    'href': '/referentiels/familles',
    'icon': faLayerGroup
  },
  {
    'label': 'Sous Famille',
    'href': '/referentiels/sous-familles',
    'icon': faCube
  },
  {
    'label': 'Articles',
    'href': '/referentiels/articles',
    'icon': faNewspaper
  },
  {
    'label':'Unite',
    'href':'/referentiels/unites',
    'icon':faRuler
  }
]

export const siteConfig = {
  referentielsItems: referentielsItems
};
