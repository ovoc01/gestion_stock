
import CrudComponent from "@/components/features/crud-components";
import { getAllArticles } from "@/services/api/article.service";
import { getAllEmplacements } from "@/services/api/batiment.service";
import { createMouvementEntree, getAllEntrees} from "@/services/api/mouvement.service";
import { ArticleDataProps, EmplacementDataProps, RowData } from "@/types/types";
import { Input } from "@nextui-org/input";
import {Divider, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export default function MouvementEntree() {

   const [data, setData] = useState<RowData[] | null>([])

   const [articles, setArticles] = useState<ArticleDataProps[] | null>([])
   const [emplacements, setEmplacements] = useState<EmplacementDataProps[] | null>([])

   const { page, size } = { page: 1, size: 5 }

   const [quantite, setQuantite] = useState<number | null>(null)
   const [prixUnitaire, setPrixUnitaire] = useState<number | null>(null)
   const [justif, setJustif] = useState<string | null>(null)

   const [pageNeedReload, setPageNeedReload] = useState(false)
   const [selectedArticle, setSelectedArticle] = useState<number | null>(null)
   const [selectedEmplacement, setSelectedEmplacement] = useState<number | null>(null)
   const [requestError,setRequestError] = useState<any>(null)
   useEffect(() => {
      getAllEntrees().then((response) => {
         setData(response.mouvements)
      }).catch((error) => {
         console.log(error)
      })

      getAllArticles({ page, size })
         .then((response) => {
            setArticles(response.articles)
         })
         .catch((error) => {
            console.log(error)
         })

      getAllEmplacements({ page, size })
         .then((response) => {
            setEmplacements(response.emplacements)
         }).catch((error) => {
            console.log(error)
         })


   }, [pageNeedReload])



   const columns = [
      {
         key: 'cmdeLigneId',
         label: 'ID',
         sortable: true
      },
      {
         key: 'article',
         label: 'Article',
         sortable: true
      },
      {
         key: 'code',
         label: 'Code',
         sortable: true
      },
      {
         key: 'reference',
         label: 'Reference',
         sortable: true
      }
      ,
      {
         key: 'emplacement',
         label: 'Emplacement',
         sortable: true
      }
      ,
      {
         key: 'prixUnitaire',
         label: 'Prix unitaire',
         sortable: true
      },
      {
         key: 'quantite',
         label: 'Quantite',
         sortable: true
      },
      {
         key: 'unite',
         label: 'Unite',
         sortable: true
      },
      {
         key: 'dateDeMouvement',
         label: 'Date du mouvement',
         sortable: true
      }
   ]

   const  handleEntreeCreation = () => {
      createMouvementEntree(quantite!, prixUnitaire!, selectedArticle!, selectedEmplacement!, justif!)
         .then((response) => {
            setPageNeedReload(!pageNeedReload)
            toast.success('Nouvelle entrée enregistrer', response)
         })
         .catch((error) => {
            console.log(error)
            setRequestError(error.response.data)
         })
   }

   const resetInput = ()=>{
      setRequestError(null)
      setQuantite(null)
      setPrixUnitaire(null)
      setJustif(null)
      
   }

   return <>
      <CrudComponent
         pageTitle="Entrée de stock"
         columns={columns}
         rowsData={data as Record<string, any>[]}
         initialPage={page}
        
         resetInput={resetInput}
         onAdd={handleEntreeCreation}
         onSearch={() => {}}
         dataAbbreviation="cmde"

         addModalContent={
            <div className="w-full flex flex-col gap-3 pb-8  p-8">
               <h1 className="text-3xl font-thin"></h1>
               <h1 className="text-small text-default-400 ml-1">Emplacement</h1>
               <div className="flex gap-4">
                  <Select
                     variant="bordered"
                     label="Emplacements"
                     size="md"
                     onChange={(e) => {
                        setSelectedEmplacement(parseInt(e.target.value))
                     }}

                     isInvalid={requestError?.emplacementError !== null && requestError?.emplacementError !== undefined}
                     errorMessage={requestError?.emplacementError}
                  >
                     {emplacements!.map((emplacement) => (
                        <SelectItem key={emplacement.emplId} value={emplacement.emplId}>
                           {emplacement.emplLi}
                        </SelectItem>
                     ))}
                  </Select>

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
                  <Input type="number" value={prixUnitaire ? prixUnitaire!.toString() : ''} label="Prix unitaire" validationBehavior="aria"
                     radius="sm" size="md" variant="bordered"
                     onChange={(e) => {
                        setPrixUnitaire(parseInt(e.target.value))
                     }}
                     isInvalid={requestError?.prixUnitaireError !== null && requestError?.prixUnitaireError !== undefined}
                     errorMessage={requestError?.prixUnitaireError}
                  />
               </div>
               <div className="flex w-full gap-4">
                  <Input type="text" label="References" validationBehavior="aria" radius="sm" size="md" variant="bordered" onChange={(e) => {

                  }} 
                  />
                  <Input type="text" value={justif!} label="Bon de commande" validationBehavior="aria" radius="sm" size="md" variant="bordered" onChange={(e) => {
                     setJustif(e.target.value)
                  }} 
                  isInvalid={requestError?.justifError !== null && requestError?.justifError !== undefined}
                  errorMessage={requestError?.justifError}
                  />
               </div>

            </div>

         }
      />
   </>
}