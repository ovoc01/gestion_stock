import IndexPage from "@/pages";
import MouvementPage from "@/pages/mouvements";
import PeriodePage from "@/pages/mouvements/periode";
import ArticlePage from "@/pages/referentiels/article";
import EmplacementPage from "@/pages/referentiels/emplacement";
import FamillePage from "@/pages/referentiels/famille";
import Layout from "@/pages/referentiels/layout";
import MagasinPage from "@/pages/referentiels/magasin";
import ServiceExploitantPage from "@/pages/referentiels/serviceExploitant";
import SousFamillePage from "@/pages/referentiels/sousFamille";
import UnitePage from "@/pages/referentiels/unite";
import UniteOperationnelPage from "@/pages/referentiels/uniteOperationnel";
import UtilisateurPage from "@/pages/utilisateurs";
import Commande from "@/pages/mouvements/commande";
import UserDetails from "@/pages/utilisateurs/userDetails";
import { createBrowserRouter } from "react-router-dom";
import MouvementSortie from "@/pages/mouvements/sortie";
import MouvementEntree from "@/pages/mouvements/entree";

export const routes = createBrowserRouter([
   {
      path: '/',
      element: <IndexPage />
   },
   {
      path: '/referentiels/',
      element: <Layout />,
      children: [
         {
            path: 'unite-operationnels',
            element: <UniteOperationnelPage />
         },
         {
            path: 'familles',
            element: <FamillePage />
         },
         {
            path: 'service-exploitants',
            element: <ServiceExploitantPage />
         },
         {
            path: 'magasins',
            element: <MagasinPage />
         },
         {
            path: 'emplacements',
            element: <EmplacementPage />
         },
         {
            path: 'sous-familles',
            element: <SousFamillePage />
         },
         {
            path: 'articles',
            element: <ArticlePage />
         },
         {
            path: 'unites',
            element: <UnitePage />
         }
      ]
   },
   {
      path: '/mouvements/',
      element: <Layout />,
      children: [
         {
            'path': 'periodes',
            element: <PeriodePage />
         },
         {
            path: 'commandes',
            element: <Commande />
         },
         {
            path:'sortie',
            element:<MouvementSortie/>
         },
         {
            path:'entree',
            element:<MouvementEntree/>
         }
      ]
   },
   {
      path: '/utilisateurs/',
      element: <Layout />,
      children: [
         {
            path: '',
            element: <UtilisateurPage />
         },
         {
            path: ':id',
            element:<UserDetails/>
         }
      ]
   }
])