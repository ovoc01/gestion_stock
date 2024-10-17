import { Input, Textarea } from "@nextui-org/input";
import { Autocomplete, AutocompleteItem, Button, DatePicker, Divider } from "@nextui-org/react";
import { useState } from "react";

export default function Livraison() {

   const [fournisseur, setFournisseur] = useState([])

   return (
      <div className="w-full flex  h-[100%] items-center justify-center gap-8 py-8">
         <div className="w-2/4 h-full pb-8 border-solid border-1  border-gray-300 rounded-lg shadow-md p-8">
            <div className="about flex flex-col gap-4 ">
               <div className="flex justify-center items-center">
                  <h1 className="text-4xl font-semibold">Nouvelle livraison</h1>
               </div>
               <h1 className="text-small text-default-400 ml-1">
                  Information de livraison
               </h1>
               <div className="flex gap-4 w-3/6">
                  <Autocomplete
                     defaultItems={fournisseur}
                     label="Fournisseur "
                     placeholder="Rechercher "
                     variant="bordered"
                     size="sm"
                  >
                     {[]}
                  </Autocomplete>
               </div>




               <div className="flex gap-4">
                  <Input
                     label="Livreur"
                     type="text"
                     variant="bordered"
                     size="sm"
                  />
                  <Input
                     label="CIN"
                     type="text"
                     variant="bordered"
                     size="sm"
                  />
               </div>

               <div className="flex gap-4 ">
                  <Input
                     label="Bon de livraison"
                     type="text"
                     variant="bordered"
                     size="sm"

                  />

                  <DatePicker
                     hideTimeZone
                     showMonthAndYearPickers
                     //defaultValue={dateCreation}
                     label="Date de livraison"
                     variant="bordered"
                     size="sm"
                  />
               </div>
               <div className="flex gap-2 w-3/6 flex-col">
                  <DatePicker
                     hideTimeZone
                     showMonthAndYearPickers
                     //defaultValue={dateCreation}
                     label="Date d'écheance"
                     variant="bordered"
                     size="sm"
                  />
                  {/*  <h1 className="text-xs text-secondary">
                     * Date
                  </h1> */}
               </div>
               <Divider className="my-2" />
               <h1 className="text-small text-default-400 ml-1">
                  Information de commande
               </h1>
               <div className="flex gap-4 ">
                  <Input
                     label="Bon de commande"
                     type="text"
                     variant="bordered"
                     size="sm"

                  />

                  <DatePicker
                     hideTimeZone
                     showMonthAndYearPickers
                     //defaultValue={dateCreation}
                     label="Date du commande"
                     variant="bordered"
                     size="sm"
                  />
               </div>
               <Divider className="my-2" />
               <h1 className="text-small text-default-400 ml-1">
                  Observation et Fichier
               </h1>
               <Textarea
                  label="Observation"
                  variant="bordered"
                  disableAnimation
               />

               <div className="w-full  flex justify-end">
                  <Button className=" rounded-md bg-foreground text-white" size="lg">
                     Enregistrez
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
