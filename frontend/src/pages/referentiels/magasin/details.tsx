import Map, { MapMarker } from "@/components/features/map";
import { useState } from "react";

export default function DetailsMagasin() {
   const [markers, setMarkers] = useState<MapMarker[]>([]);
   const [unopPosition, setUnopPosition] = useState<{ lat: number; lng: number } | null>({ lat: -18.870134, lng: 47.5205636 });
   return (
      <div className="w-full flex  h-[100%] items-center gap-8 py-8">

         <div className="w-3/5 h-full pb-8 border-solid border-1  border-gray-300 rounded-lg shadow-md p-8">
            <div className="about flex flex-col gap-4 ">
               <div className="flex justify-between items-center">
                  <h1 className="text-5xl font-bold ">Magasin PK 13</h1>
                  <h1 className="text-xl flex flex-col text-center">Valorisation:
                     <span className="text-3xl text-secondary italic font-semibold">3,000,000 Ar</span>
                  </h1>
               </div>
               <h1 className="text-3xl font-light text-gray-500 mt-4">À propos</h1>
               <h1 className="text-md text-primary"> Création:
                  <span className="text-black ml-2">22 Novembre 2017</span>
                  <span className="text-black ml-2"> par Tendry Rakoto</span>
               </h1>
               <h1 className="text-md  flex justify-between">
                  <span className="text-black">
                     <span className="text-primary">Adresse:</span> PK 13 Route de Majunga
                  </span>
                  <span className="text-primary">Coordonnée:
                     <span className="text-black ml-2">-18.870134, 47.5205636</span>
                  </span>
               </h1>
               <h1 className="text-md text-primary"> Téléphone:
                  <span className="text-black ml-2">+261 32 05 123 45</span>
               </h1>
               <h1 className="text-md text-primary">
                  Responsable:
                  <span className="text-black ml-2">Voary Rakotoarison</span>
               </h1>
               <h1 className="text-md text-primary">
                  Utilisateur associé:
                  <span className="font-bold text-black ml-2">Tendry Rakoto, Marine Razakarivony, Lalason Ranaivosoa</span>
               </h1>
               <h1 className="text-md text-primary">
                  Nombre d'Emplacement:
                  <span className="font-bold text-black ml-2">4</span>
               </h1>
               
            </div>


            <div className=" mt-5 flex flex-col  ">
               <h1 className="text-lg font-light text-gray-500">Stock Par Emplacement</h1>
               <table className=" mt-4 table-auto ">
                  <thead>
                     <tr className="text-gray-500 border-b border-gray-500">
                        <th className="font-light text-center">Emplacement</th>
                        <th className="font-light text-center">Code Article</th>
                        <th className="font-light text-center">Quantité</th>
                        <th className="font-light text-center">Unité</th>
                        <th className="font-light text-center">Prix Unitaire</th>
                        <th className="font-light text-center">Quantité</th>
                        <th className="font-light text-center">Prix Total</th>
                     </tr>
                  </thead>
                  <tbody className="">
                     <tr className="text-gray-500 border-b border-gray-300">
                        <td className="font-light text-center py-4" text-center>Conteneur 23ER40-4O Total</td>
                        <td className="font-light text-center ">INETCERO-CO/CA-GA-20240925</td>
                        <td className="font-light text-center">10</td>
                        <td className="font-light text-center">litre</td>
                        <td className=" text-center text-primary italic">10,000 Ar</td>
                        <td className="font-light text-center">100</td>
                        <td className="font-bold text-lg text-center text-primary">1,000,000 Ar</td>
                     </tr>
                     <tr className="text-gray-500">
                        <td className="font-light text-center py-4" text-center>Conteneur 23ER40-4O Total</td>
                        <td className="font-light text-center "> INETCERO-POLO/TR-BR87-20240925</td>
                        <td className="font-light text-center">10</td>
                        <td className="font-light text-center">Unité</td>
                        <td className=" text-center text-primary italic">10,000,000 Ar</td>
                        <td className="font-light text-center">100</td>
                        <td className="font-bold text-lg text-center text-primary italic">1,000,000,000 Ar</td>
                     </tr>
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