import Map, { MapMarker } from "@/components/features/map";
import { getMagasinDetails } from "@/services/api/batiment.service";
import { MagasinDetails } from "@/types/types";
import { formatCurrency } from "@/utils/formatter";
import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";

export default function DetailsMagasin() {
   const searchParams = new URLSearchParams(location.search);
   const idMagasin = searchParams.get('idMagasin') ? parseInt(searchParams.get('idMagasin')!) : null;
   const [magasin, setMagasin] = useState<MagasinDetails | null>(null)

   useEffect(() => {
      getMagasinDetails(idMagasin!)
         .then((data) => {
            setMagasin(data.magasin)
            console.log(data.magasin)
         }).catch((err) => {
            console.log(err)
         })
   }, [idMagasin])

   const [markers, setMarkers] = useState<MapMarker[]>([]);
   const [unopPosition, setUnopPosition] = useState<{ lat: number; lng: number } | null>({ lat: -18.870134, lng: 47.5205636 });
   return (
      <div className="w-full flex  h-[100%] items-center gap-8 py-8">

         <div className="w-3/5 h-full pb-8 border-solid border-1  border-gray-300 rounded-lg shadow-md p-8">
            <div className="about flex flex-col gap-4 ">
               <div className="flex justify-between items-center">
                  <h1 className="text-5xl font-bold ">{magasin?.info.magasin}</h1>
                  <Button size="md" className=" rounded-md bg-primary text-white">Ajouter Emplacement</Button>
                  <h1 className="text-xl flex flex-col text-center">Valorisation:
                     <span className="text-3xl text-secondary italic font-semibold">3,000,000 Ar</span>
                  </h1>
               </div>
               <h1 className="text-3xl font-light text-gray-500 mt-4">À propos</h1>
               <h1 className="text-md text-primary"> Création:
                  <span className="text-black ml-2">{magasin?.info.niceDate}</span>
                  <span className="text-black ml-2"> par Tendry Rakoto</span>
               </h1>
               <h1 className="text-md  flex justify-between">
                  <span className="text-black">
                     <span className="text-primary">Adresse:</span> {magasin?.info.magasin}
                  </span>
                  <span className="text-primary">Coordonnée:
                     <span className="text-black ml-2">-18.870134, 47.5205636</span>
                  </span>
               </h1>
               <h1 className="text-md text-primary"> Téléphone:
                  <span className="text-black ml-2">{magasin?.info.telephone}</span>
               </h1>
               <h1 className="text-md text-primary">
                  Responsable:
                  <span className="text-black ml-2">Voary Rakotoarison</span>
               </h1>
               <h1 className="text-md text-primary">
                  Utilisateur associé:
                  <span className="font-bold text-black ml-2">{magasin?.info.utilisateurs}</span>
               </h1>
               <h1 className="text-md text-primary">
                  Nombre d'Emplacement:
                  <span className="font-bold text-black ml-2">{magasin?.info.nombreEmplacement}</span>
               </h1>

            </div>

            <div className=" mt-5 flex flex-col  ">
               <h1 className="text-lg font-light text-gray-500">Stock Par Emplacement</h1>
               <table className=" mt-4 table-auto ">
                  <thead>
                     <tr className="text-gray-500 border-b border-gray-500">
                        <th className="font-light text-center">Emplacement</th>
                        <th className="font-light text-center">Article</th>
                        <th className="font-light text-center">Code Article</th>
                        <th className="font-light text-center">Quantité</th>
                        <th className="font-light text-center">CMUP</th>
                        <th className="font-light text-center">Prix Total</th>
                     </tr>
                  </thead>
                  <tbody className="">
                     {
                        magasin?.stocks?.map((stock) => (
                           <tr className="text-gray-500 border-b border-gray-300">
                              <td className="font-light text-center py-4" text-center>{stock.emplacement}</td>
                              <td className="font-light text-center ">{stock.article}</td>
                              <td className="font-light text-center ">{stock.code_article}</td>
                              <td className="font-light text-center">{stock.quantite}</td>
                              <td className=" text-center text-primary italic">{formatCurrency(stock.cmup)}</td>
                              <td className="font-bold text-lg text-center text-primary">{formatCurrency(stock.prixTotal)}</td>
                           </tr>
                        ))
                     }
                  </tbody>
               </table>
            </div>

            <div className=" mt-5 flex flex-col gap-2">
               <h1 className="text-lg font-light text-gray-500">Montant</h1>
               <div className="flex flex-col gap-2">
                  <h1 className="text-lg ">Montant Total Sortie: <span className="text-primary font-semibold">20 000 000,00 Ar</span></h1>
                  <h1 className="text-lg ">Montant Total Entrée: <span className="text-primary font-semibold">20 000 000,00 Ar</span></h1>
               </div>
               <h6 className="text-sm italic ">
                  Nb: * Les montants affichés sont des montants estimatifs et peuvent varier en fonction des mouvements de stock et ils sont tirés du periodes actuels.
               </h6>
            </div>


         </div>
         <Map center={unopPosition!} markers={markers} className=" w-2/5 h-full" />

      </div>
   )
}