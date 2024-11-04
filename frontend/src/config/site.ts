import {
  faArrowDownUpAcrossLine,
  faArrowLeft, faArrowRight,
  faBalanceScale,
  faBrain, faBuilding, faBuildingShield, faCalendarCheck,
  faChartSimple,
  faCube, faDatabase, faLayerGroup, faMapLocationDot, faMoneyBillTransfer, faNewspaper,
  faRuler, faScaleBalanced, faTruck, faUsers, faWarehouse
} from "@fortawesome/free-solid-svg-icons";
import { CSDropdownItemProps } from "@/types/types";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
export type SiteConfig = typeof siteConfig;


export type NavBarItems = {
  key: string;
  label: string;
  href: string;
  icon?: IconProp
  dropdownItems?: CSDropdownItemProps[];
}
const referentielsItems: CSDropdownItemProps[] = [
  {
    label: 'Service Exploitant',
    href: '/referentiels/service-exploitants',
    icon: faBuildingShield
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
    'label': 'Unite',
    'href': '/referentiels/unites',
    'icon': faRuler
  }
]

const mouvementsItems: CSDropdownItemProps[] = [
  {
    'label': 'Periodes',
    'href': '/mouvements/periodes',
    icon: faCalendarCheck
  },
  {
    'label': 'Entrée',
    'href': '/mouvements/entree',
    icon: faArrowRight
  },
  {
    'label': 'Sortie',
    'href': '/mouvements/commandes',
    icon: faArrowLeft
  }
]

const userItems: CSDropdownItemProps[] = [
  {
    'label': 'Listes',
    'href': '/utilisateurs',
    icon: faUsers
  },
]

const stockItems: CSDropdownItemProps[] = [
  {
    'label': 'Valorisation',
    'href': '/stocks',
    icon: faMoneyBillTransfer
  },
  {
    'label': 'Prévision',
    'href': '/stocks/previsions',
    icon: faBrain,
    isDibbled: true
  }
]

export const siteConfig = {
  referentielsItems: referentielsItems,
  mouvementsItems: mouvementsItems,
  userItems: userItems,
  stockItems: stockItems
};


export const SimpleUserNavBar: NavBarItems[] = [
  {
    key: 'magasin',
    label: 'Magasin',
    href: '/magasins',
    icon: faWarehouse
  },
  {
    key: 'livraison',
    label: 'Livraison',
    href: '/livraisons',
    icon: faTruck
  },
  {
    key: 'commandes',
    label: 'Commandes',
    href: '/commandes',
    icon: faNewspaper
  }
  ,
  /* {
    key: 'mouvement',
    label: 'Mouvement',
    href: '/mouvements',
    icon: undefined,
    dropdownItems: [

      {
        'label': 'Entrée',
        'href': '/mouvements/entree',
        icon: faArrowRight
      },
      {
        'label': 'Sortie',
        'href': '/mouvements/commandes',
        icon: faArrowLeft
      }
    ]
  }, */
  {
    key: 'Stock',
    label: 'Stock',
    href: '/stock',
    icon: faBalanceScale,
    dropdownItems: siteConfig.stockItems
  }
]

export const AdminNavbarItems: NavBarItems[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/dashboards',
    icon: faChartSimple
  },

  {
    key: 'users',
    label: 'Utilisateurs',
    href: '/utilisateurs',
    icon: faUsers
  },



  {
    key: 'mouvement',
    label: 'Mouvement',
    href: 'empty-0',
    icon: faArrowDownUpAcrossLine,
    dropdownItems: siteConfig.mouvementsItems
  }

  ,
  {
    key: 'réferentiels',
    label: 'Réferentiels',
    href: 'empty-1',
    icon: faDatabase,
    dropdownItems: siteConfig.referentielsItems
  }
  ,

  {
    key: 'stock',
    label: 'Stock',
    href: 'empty-2',
    icon: faScaleBalanced,
    dropdownItems: siteConfig.stockItems
  },

]