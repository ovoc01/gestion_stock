import IndexPage from "@/pages";
import ArticlePage from "@/pages/referentiels/article";
import EmplacementPage from "@/pages/referentiels/emplacement";
import FamillePage from "@/pages/referentiels/famille";
import Layout from "@/pages/referentiels/layout";
import MagasinPage from "@/pages/referentiels/magasin";
import ServiceExploitantPage from "@/pages/referentiels/serviceExploitant";
import SousFamillePage from "@/pages/referentiels/sousFamille";
import UniteOperationnelPage from "@/pages/referentiels/uniteOperationnel";
import { createBrowserRouter } from "react-router-dom";

export const routes = createBrowserRouter([
   {
      path:'/',
      element:<IndexPage/>
   },
   {
      path:'/referentiels/',
      element:<Layout/>,
      children:[
         {
            path:'unite-operationnels',
            element:<UniteOperationnelPage/>
         },
         {
            path:'familles',
            element:<FamillePage/>
         },
         {
            path:'service-exploitants',
            element:<ServiceExploitantPage/>
         },
         {
            path:'magasins',
            element:<MagasinPage/>
         },
         {
            path:'emplacements',
            element:<EmplacementPage/>
         },
         {
            path:'sous-familles',
            element:<SousFamillePage/>
         },
         {
            path:'articles',
            element:<ArticlePage/>
         }
      ]  
   }
])