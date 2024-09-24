import {  faArrowLeft, faArrowRight, faBuilding, faBuildingShield, faCalendarCheck, faCube, faLayerGroup, faMapLocationDot, faNewspaper, faRuler, faUsers, faWarehouse } from "@fortawesome/free-solid-svg-icons";
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

const mouvementsItems:CSDropdownItemProps[] = [
  {
    'label':'Periodes',
    'href':'/mouvements/periodes',
    icon:faCalendarCheck
  },
  {
    'label':'Entrée',
    'href':'/mouvements',
    icon:faArrowRight
  },
  {
    'label':'Sortie',
    'href':'/mouvements/sortie',
    icon:faArrowLeft
  }
]

const userItems:CSDropdownItemProps[] = [
  {
    'label':'Listes',
    'href':'/utilisateurs', 
    icon:faUsers
  },
]

export const siteConfig = {
  referentielsItems: referentielsItems,
  mouvementsItems: mouvementsItems,
  userItems:userItems
};
