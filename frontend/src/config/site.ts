import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Vite + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Dashboard",
      href: "/",
      isDropDown: false
    },
    {
      label: "Réferentiels",
      href: "/docs",
      child:[
        {
            label:'Articles',
            href:'/referentiels/articles'
        }
      ]
    },
    {
      label: "Mouvement",
      href: "/pricing",
      
    },

  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui-docs-v2.vercel.app",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
  referentielsItems: [
    
    {
      'label':'Unité operationnel',
      'href':'/referentiels/uniteOperationnel',
      'icon': faCheckCircle
    },
    {
      'label':'Magasin',
      'href':'/referentiels/magasin',
      'icon': faCheckCircle
    },
    {
      'label':'Emplacement',
      'href':'/referentiels/emplacement',
      'icon': faCheckCircle
    },
    {
      'label':'Famille',
      'href':'/referentiels/famille',
      'icon': faCheckCircle
    },
    {
      'label':'Sous Famille',
      'href':'/referentiels/sousFamille',
      'icon': faCheckCircle
    },
    {
      'label':'Articles',
      'href':'/referentiels/articles',
      'icon': faCheckCircle
    },
  ]
};
