import { Input, Textarea } from "@nextui-org/input";
import { Autocomplete, AutocompleteItem, Button, Checkbox, DatePicker, Divider } from "@nextui-org/react";
import { useState } from "react";
import { now, getLocalTimeZone, DateValue } from "@internationalized/date";
import { createLivraison } from "@/services/api/livraison.service";
export default function Livraison() {


   //state
   const [fournisseur, setFournisseur] = useState<number | null>()
   const [livreur, setLivreur] = useState('')
   const [cin, setCIN] = useState('')
   const [bonLivraison, setBonLivraison] = useState('')
   const [dateLivraison, setDateLivraison] = useState<DateValue>(now(getLocalTimeZone()));
   const [dateEcheance, setDateEcheance] = useState<DateValue>(now(getLocalTimeZone()));
   const [bonCommande, setBonCommande] = useState('')
   const [dateCommande, setDateCommande] = useState<DateValue>(now(getLocalTimeZone()));
   const [observation, setObservation] = useState('')
   const [requestError, setRequestError] = useState<any>(null);
   const [isDetailsBoxChecked, setIsDetailsBoxChecked] = useState(false)

   // url parameter


   //useEffect

   const fakeFournisseurs = [
      { id: 1, name: 'Sidef' },
      { id: 2, name: 'Sogea' },
      { id: 3, name: 'MadaAuto' },
      { id: 4, name: 'Sotrami' },
   ]

   // static data
   const detailsTableColumns = [
      { key: 'produit', label: 'Produit' },
      { key: 'quantite', label: 'Quantité' },
      { key: 'prix', label: 'Prix' },
      { key: 'total', label: 'Total' },
   ]



   //handlers
   const onFormSubmit = async () => {
      /* setRequestError({
         fournisseurError: fournisseur === 0 ? 'Veuillez sélectionner un fournisseur' : null,
         livreurError: livreur.length === 0 ? 'Veuillez saisir le nom du livreur' : null,
         cinError: cin.length === 0 ? 'Veuillez saisir le CIN du livreur' : null,
         bonLivraisonError: bonLivraison.length === 0 ? 'Veuillez saisir le bon de livraison' : null,
         dateLivraisonError: dateLivraison === null ? 'Veuillez saisir la date de livraison' : null,
         dateEcheanceError: dateEcheance === null ? 'Veuillez saisir la date d\'écheance' : null,
         bonCommandeError: bonCommande.length === 0 ? 'Veuillez saisir le bon de commande' : null,
         dateCommandeError: dateCommande === null ? 'Veuillez saisir la date de commande' : null,
      }) */

      await createLivraison({
         fournisseur: 1,
         livreur: livreur,
         cin: cin,
         bonLivraison: bonLivraison,
         dateLivraison: dateLivraison!.toDate(getLocalTimeZone()),
         dateEcheance: dateEcheance!.toDate(getLocalTimeZone()),
         bonCommande: bonCommande,
         dateCommande: dateCommande!.toDate(getLocalTimeZone()),
         observation: observation
      }).catch((error) => {
         setRequestError(error.response.data)
         setTimeout(() => {
            setRequestError(null)
         }, 10000)
      })
   }

   const onFournisseurChange = (item: any) => {
      if (item) {
         setFournisseur(parseInt(item.toString()))
      }
   }


   const NewDetails = () => {
      return
   }


   return (
      <div className="w-full flex  h-[100%] items-center justify-center gap-8 py-8">
         <div className="w-2/5 h-full pb-8 border-solid border-1  border-gray-300 rounded-lg shadow-md p-8">
            <div className="about flex flex-col gap-4 ">
               <div className="flex justify-center items-center">
                  <h1 className="text-4xl font-semibold">Nouvelle Entrée</h1>
               </div>
               <h1 className="text-small text-default-400 ml-1">
                  Information de livraison
               </h1>
               <div className="flex gap-4 w-3/6">
                  <Autocomplete
                     defaultItems={fakeFournisseurs}
                     label="Fournisseur "
                     placeholder="Rechercher "
                     variant="bordered"
                     size="sm"
                     isInvalid={requestError?.fournisseurError !== null && requestError?.fournisseurError !== undefined}
                     errorMessage={requestError?.fournisseurError}
                     listboxProps={{
                        emptyContent: 'Aucun fournisseur trouvé',
                     }}
                     isClearable
                     onSelectionChange={(item) => onFournisseurChange(item)}
                     defaultSelectedKey={1}

                  >
                     {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                  </Autocomplete>
               </div>

               <div className="flex gap-4">
                  <Input
                     label="Livreur"
                     type="text"
                     variant="bordered"
                     size="sm"
                     isInvalid={requestError?.livreurError !== null && requestError?.livreurError !== undefined}
                     errorMessage={requestError?.livreurError}
                     value={livreur}
                     onChange={(e) => setLivreur(e.target.value)}
                  />
                  <Input
                     label="CIN"
                     type="text"
                     variant="bordered"
                     size="sm"
                     isInvalid={requestError?.cinError !== null && requestError?.cinError !== undefined}
                     errorMessage={requestError?.cinError}
                     value={cin}
                     onChange={(e) => setCIN(e.target.value)}
                  />
               </div>

               <div className="flex gap-4 ">
                  <Input
                     label="Bon de livraison"
                     type="text"
                     variant="bordered"
                     size="sm"
                     isInvalid={requestError?.bonLivraisonError !== null && requestError?.bonLivraisonError !== undefined}
                     errorMessage={requestError?.bonLivraisonError}
                     value={bonLivraison}
                     onChange={(e) => setBonLivraison(e.target.value)}

                  />

                  <DatePicker
                     hideTimeZone


                     //defaultValue={dateCreation}
                     label="Date de livraison"
                     variant="bordered"
                     size="sm"
                     isInvalid={requestError?.dateLivraisonError !== null && requestError?.dateLivraisonError !== undefined}
                     errorMessage={requestError?.dateLivraisonError}
                     value={dateLivraison}
                     onChange={(e) => setDateLivraison(e)}
                  />
               </div>
               <div className="flex gap-2 w-3/6 flex-col">
                  <DatePicker
                     hideTimeZone
                     granularity="day"
                     //defaultValue={dateCreation}
                     label="Date d'écheance"
                     variant="bordered"
                     size="sm"
                     isInvalid={requestError?.dateEcheanceError !== null && requestError?.dateEcheanceError !== undefined}
                     errorMessage={requestError?.dateEcheanceError}
                     value={dateEcheance}
                     onChange={(e) => setDateEcheance(e)}
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
                     isInvalid={requestError?.bonCommandeError !== null && requestError?.bonCommandeError !== undefined}
                     errorMessage={requestError?.bonCommandeError}
                     value={bonCommande}
                     onChange={(e) => setBonCommande(e.target.value)}
                  />

                  <DatePicker
                     hideTimeZone
                     granularity="day"

                     //defaultValue={dateCreation}
                     label="Date du commande"
                     variant="bordered"
                     size="sm"
                     isInvalid={requestError?.dateCommandeError !== null && requestError?.dateCommandeError !== undefined}
                     errorMessage={requestError?.dateCommandeError}
                     value={dateCommande}
                     onChange={(e) => setDateCommande(e)}
                  />
               </div>
               <Divider className="my-2" />
               <h1 className="text-small text-default-400 ml-1">
                  Observation
               </h1>
               <Textarea
                  label="Observation"
                  variant="bordered"
                  disableAnimation
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
               />
               <Checkbox radius="sm" color="primary" isSelected={isDetailsBoxChecked} onClick={() => setIsDetailsBoxChecked(!isDetailsBoxChecked)}>
                  <h1 className="text-sm">Détails</h1>
               </Checkbox>

               <div className="w-full  flex justify-end">
                  <Button className=" rounded-md bg-foreground text-white" size="lg" onPress={onFormSubmit}>
                     Enregistrez
                  </Button>
               </div>
            </div>
         </div>
         {
            isDetailsBoxChecked && (
               <div className="w-3/5 h-full  pb-8 border-solid border-1  border-gray-300 rounded-lg shadow-md p-8">
                  <div className="flex justify-center items-center">
                     <h1 className="text-4xl font-semibold">Détails du livraison</h1>
                  </div>

               </div>
            )
         }

      </div>
   );
}
