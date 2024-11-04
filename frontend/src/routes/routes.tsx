import { createBrowserRouter } from "react-router-dom";

import PeriodePage from "@/pages/mouvements/periode";
import ArticlePage from "@/pages/referentiels/article/index";
import EmplacementPage from "@/pages/referentiels/magasin/emplacement";
import FamillePage from "@/pages/referentiels/article/famille";
import Layout from "@/pages/referentiels/layout";
import MagasinPage from "@/pages/referentiels/magasin/index";
import ServiceExploitantPage from "@/pages/referentiels/service/index";
import SousFamillePage from "@/pages/referentiels/article/sous-famille";
import UnitePage from "@/pages/referentiels/article/unite";
import UniteOperationnelPage from "@/pages/referentiels/unop/index";
import UtilisateurPage from "@/pages/utilisateurs";
import { UserDetails } from "@/pages/utilisateurs/user-details";
import MouvementSortie from "@/pages/mouvements/sortie";
import MouvementEntree from "@/pages/mouvements/entree";
import ValorisationStock from "@/pages/stock";
import DetailsMagasin from "@/pages/referentiels/magasin/details";
import DashboardPage from "@/pages/dashboard";
import Livraison from "@/pages/livraison";
import AdLayout from "@/layouts/_admin";
import CommonUserAuthentication from "@/pages/auth/common";
import AdminAuthentication from "@/pages/auth/admin";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <CommonUserAuthentication />

  },
  {
    path: "/secure/sesion",
    element: <AdminAuthentication />

  },
  {
    path: "/referentiels/",
    element: <AdLayout />,
    children: [
      {
        path: "unite-operationnels",
        element: <UniteOperationnelPage />,
      },
      {
        path: "familles",
        element: <FamillePage />,
      },
      {
        path: "service-exploitants",
        element: <ServiceExploitantPage />,
      },
      {
        path: "magasins",
        element: <MagasinPage />,
      },
      {
        path: "emplacements",
        element: <EmplacementPage />,
      },
      {
        path: "sous-familles",
        element: <SousFamillePage />,
      },
      {
        path: "articles",
        element: <ArticlePage />,
      },
      {
        path: "unites",
        element: <UnitePage />,
      },
    ],
  },
  {
    path: "/mouvements/",
    element: <AdLayout />,
    children: [
      {
        path: "periodes",
        element: <PeriodePage />,
      },
      {
        path: "commandes",
        element: <MouvementSortie />,
      },
      {
        path: "sortie",
        element: <MouvementSortie />,
      },
      {
        path: "entree",
        element: <MouvementEntree />,
      },
    ],
  },
  {
    path: "/utilisateurs/",
    element: <AdLayout />,
    children: [
      {
        path: "",
        element: <UtilisateurPage />,
      },
      {
        path: ":id/*",
        element: <UserDetails />,
      },
    ],
  },
  {
    path: "/stocks/",
    element: <AdLayout />,
    children: [
      {
        path: "",
        element: <ValorisationStock />,
      },
    ],
  },
  {
    path: "/details",
    element: <AdLayout />,
    children: [
      {
        path: "",
        element: <DetailsMagasin />,
      },
    ],
  },
  {
    path: "/dashboards",
    element: <AdLayout />,
    children: [
      {
        path: "",
        element: <DashboardPage />,
      },
    ],
  },

  {
    path: "/livraisons",
    element: <AdLayout />,
    children: [
      {
        path: "",
        element: <Livraison />
      }]
  }
  ,
  {
    path: "/magasins",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <MagasinPage />,
      },
    ],
  },
]);
