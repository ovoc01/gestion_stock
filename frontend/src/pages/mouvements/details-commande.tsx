import { getAllArticles } from "@/services/api/article.service";
import { createMouvementSortie, getAllSortiesByIdCommande } from "@/services/api/mouvement.service";
import { ArticleDataProps, CommandeData, CommandeDetails, MagasinDetails } from "@/types/types";
import { formatCurrency } from "@/utils/formatter";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Modal, ModalContent, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Divider, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DetailsCommande() {
   const { isOpen, onOpen, onOpenChange } = useDisclosure();
   const searchParams = new URLSearchParams(location.search);
   const idCommande = searchParams.get('idCommande') ? parseInt(searchParams.get('idCommande')!) : null;
   const [magasin, setMagasin] = useState<MagasinDetails | null>(null)
   const [details, setDetails] = useState<CommandeDetails | null>()
   const [requestError, setRequestError] = useState<any>('')

   const [quantite, setQuantite] = useState<number | null>(null)



   const [pageNeedReload, setPageNeedReload] = useState(false)

   const [selectedArticle, setSelectedArticle] = useState<number | null>(null)
   const [articles, setArticles] = useState<ArticleDataProps[] | null>([])

   const { page, size } = { page: 1, size: 5 }
   useEffect(() => {
      getAllSortiesByIdCommande(idCommande!).then((response) => {
         setDetails(response.commande)
      }).catch((err) => {
         console.log(err)
      })

      getAllArticles({ page, size })
         .then((response) => {
            setArticles(response.articles)
         })
         .catch((error) => {
            console.log(error)
         })

   }, [idCommande,pageNeedReload])

   const addMouvementSortie = () => {
      createMouvementSortie(quantite!, selectedArticle!, idCommande!)
         .then((response) => {
            setPageNeedReload(!pageNeedReload)
            toast.success('Sortie enregistré', response)
         }).catch((error) => {
            console.log(error)
            //toast.error('Erreur lors de l\'enregistrement de la sortie',error)
            setRequestError(error.response.data)
         })
   }


   return (
      <>
         <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
            <ModalContent>
               {
                  (onClose) => (
                     <>
                        <ModalBody>

                           <h1 className="text-3xl font-thin"></h1>
                           <h1 className="text-small text-default-400 ml-1">Commande</h1>

                           <div className="flex gap-4">
                              <Input isDisabled value={details?.info.emplacement} type="text" label="De" validationBehavior="aria" radius="sm" size="md" variant="bordered" onChange={(e) => {

                              }} />
                              <Input type="text" value={details?.info.uniteOperationnel} isDisabled label="Vers" validationBehavior="aria" radius="sm" size="md" variant="bordered" />
                           </div>

                           <Divider className="my-4" />
                           <h1 className="text-small text-default-400 ml-1">Details du mouvements</h1>
                           <div className="flex w-full gap-4">
                              <Select
                                 variant="bordered"
                                 label="Articles"
                                 size="md"
                                 onChange={(e) => {
                                    setSelectedArticle(parseInt(e.target.value))
                                 }}

                                 selectedKeys={selectedArticle ? [selectedArticle.toString()] : []}
                                 isInvalid={requestError?.articleError !== null && requestError?.articleError !== undefined}
                                 errorMessage={requestError?.articleError}
                              >
                                 {articles!.map((article) => (
                                    <SelectItem key={article.artId} value={article.artId}>
                                       {article.artLi}
                                    </SelectItem>
                                 ))}
                              </Select>
                           </div>
                           <div className="flex  gap-4">
                              <Input type="number" value={quantite ? quantite!.toString() : ''} label="Quantite" validationBehavior="aria" radius="sm" size="md" variant="bordered" onChange={(e) => {
                                 setQuantite(parseInt(e.target.value))

                              }}
                                 isInvalid={requestError?.quantiteError !== null && requestError?.quantiteError !== undefined}
                                 errorMessage={requestError?.quantiteError}
                              />

                           </div>
                           <div className="flex w-full gap-4">
                              <Input type="text" label="References" validationBehavior="aria" radius="sm" size="md" variant="bordered" onChange={(e) => {

                              }}
                                 isInvalid={requestError?.referenceError !== null && requestError?.referenceError !== undefined}
                                 errorMessage={requestError?.referenceError}
                              />
                           </div>

                        </ModalBody>
                        <ModalFooter>
                           <Button
                              color="danger"
                              radius="sm"
                              size="lg"
                              variant="light"
                              onPress={() => {
                                 onClose();
                              }}
                           >
                              Annuler
                           </Button>
                           <Button
                              className="bg-foreground text-background"
                              radius="sm"
                              size="lg"
                              onPress={addMouvementSortie}
                           >
                              Valider
                           </Button>
                        </ModalFooter>
                     </>

                  )
               }

            </ModalContent>
         </Modal>
         <div className="w-full flex  h-fit items-center justify-center gap-8 py-8">


            <div className="w-3/5 h-full pb-8 border-solid border-1  border-gray-300 rounded-lg shadow-md p-8">
               <div className="about flex flex-col gap-4 ">
                  <div className="flex justify-between items-center">
                     <h1 className="text-5xl font-bold ">CMDE-1230</h1>
                     <Button size="lg" className=" rounded-md bg-primary text-white" onPress={onOpenChange}>Nouvelle ligne</Button>
                     <h1 className="text-xl flex flex-col text-center">Montant Total:
                        <span className="text-3xl text-secondary italic font-semibold">{formatCurrency(magasin?.valorisations!)}</span>
                     </h1>
                  </div>
                  <h1 className="text-3xl font-light text-gray-500 mt-4">À propos</h1>
                  <h1 className="text-md text-primary"> Création:
                     <span className="text-black ml-2">{details?.info.lib_commande}</span>
                     <span className="text-black ml-2"> par Tendry Rakoto</span>
                  </h1>
                  <h1 className="text-md  flex justify-between">
                     <span className="text-black">
                        <span className="text-primary">DE:</span> {details?.info.emplacement}
                     </span>
                     <span className="text-primary">À:
                        <span className="text-black ml-2">{details?.info.uniteOperationnel}</span>
                     </span>
                  </h1>
                  <h1 className="text-md text-primary"> Téléphone:
                     <span className="text-black ml-2">{magasin?.info.telephone}</span>
                  </h1>
                  <h1 className="text-md text-primary">
                     Responsable:
                     <span className="text-black ml-2">Voary Rakotoarison</span>
                  </h1>
               </div>

               <div className=" mt-5 flex flex-col  ">
                  <h1 className="text-lg font-light text-gray-500">Details du commandes</h1>
                  <table className=" mt-4 table-auto ">
                     <thead>
                        <tr className="text-gray-500 border-b border-gray-500">

                           <th className="font-light text-center">Article</th>
                           <th className="font-light text-center">Code Article</th>
                           <th className="font-light text-center">Quantité</th>
                           <th className="font-light text-center">CMUP</th>
                           <th className="font-light text-center">Prix Total</th>
                        </tr>
                     </thead>
                     <tbody className="">
                        {
                           details?.details.map((dts) => (
                              <tr className="text-gray-500 border-b border-gray-300">

                                 <td className="font-light text-center ">{dts.article}</td>
                                 <td className="font-light text-center ">{dts.code}</td>
                                 <td className="font-light text-center">{dts.quantite}</td>
                                 <td className=" text-center text-primary italic">{formatCurrency(dts.prixUnitaire)}</td>
                                 <td className="font-bold text-lg text-center text-primary">{formatCurrency(dts.prixUnitaire * dts.quantite)}</td>
                              </tr>
                           ))
                        }
                     </tbody>
                  </table>
               </div>

               <div className=" mt-5 flex flex-col gap-2">
                  <h6 className="text-sm italic ">
                     Nb: * Les montants affichés sont des montants estimatifs et peuvent varier en fonction des mouvements de stock et ils sont tirés du periodes actuels.
                  </h6>
               </div>


            </div>
         </div>
      </>


   )
}