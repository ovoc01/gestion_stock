
import { BASE_URL, requestHeaders } from "@/shared/shared";
import axios from "axios";
import { Livraison } from "@/types/types";

export const createLivraison = async (livraison: Livraison) => {
   const response = await axios.post(
      BASE_URL + "livraisons",
      {
         fournisseur: livraison.fournisseur,
         livreur: livraison.livreur,
         cin: livraison.cin,
         bonLivraison: livraison.bonLivraison,
         dateLivraison: livraison.dateLivraison,
         dateEcheance: livraison.dateEcheance,
         bonCommande: livraison.bonCommande,
         dateCommande: livraison.dateCommande,
         observation: livraison.observation,
      },
      {
         headers: requestHeaders,
      }
   );

   return response.data;
}