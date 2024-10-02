import { getAllArticles } from "@/services/api/article.service";
import { createMouvementSortie, getAllCommandes, getAllSorties } from "@/services/api/mouvement.service";
import { ArticleDataProps, CommandeData, RowData } from "@/types/types";
import { Input } from "@nextui-org/input";
import { Button, Divider, getKeyValue, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export default function MouvementSortie() {

   const [data, setData] = useState<RowData[] | null>([])

   const [articles, setArticles] = useState<ArticleDataProps[] | null>([])
   const [commandes, setCommandes] = useState<CommandeData[] | null>([])

   const { page, size } = { page: 1, size: 5 }

   const [quantite, setQuantite] = useState<number | null>(null)
   const [requestError, setRequestError] = useState<any>(null)


   const [pageNeedReload, setPageNeedReload] = useState(false)

   const [selectedArticle, setSelectedArticle] = useState<number | null>(null)
   const [selectedCommande, setSelectedCommande] = useState<number | null>(null)
   const [emplacementDe, setEmplacementDe] = useState<string | null>(null)
   const [unopA, setUnopA] = useState<string | null>(null)


   useEffect(() => {
      getAllSorties().then((response) => {
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

      getAllCommandes().then((response) => {
         setCommandes(response.commandes)
      })
         .catch((error) => {
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

   const addMouvementSortie = () => {
      createMouvementSortie(quantite!, selectedArticle!, selectedCommande!)
         .then((response) => {
            setPageNeedReload(!pageNeedReload)
            toast.success('Sortie enregistré', response)
         }).catch((error) => {
            console.log(error)
            //toast.error('Erreur lors de l\'enregistrement de la sortie',error)
            setRequestError(error.response.data)
         })
   }

   return <>

      <div className="w-full flex flex-col gap-5 pt-5 justify-start">
         <div className="w-2/5 flex flex-col gap-3 pb-8 border-solid border-1  border-gray-300 rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-thin"></h1>
            <h1 className="text-small text-default-400 ml-1">Commande</h1>
            <Select
               variant="bordered"
               label="Commande"
               size="md"
               onChange={(e) => {
                  setSelectedCommande(parseInt(e.target.value))
                  console.log(commandes!.find((com) => com.cmdeId === parseInt(e.target.value))?.emplacement || null)
                  setEmplacementDe(commandes!.find((com) => com.cmdeId === parseInt(e.target.value))?.emplacement || null);
                  setUnopA(commandes!.find((com) => com.cmdeId === parseInt(e.target.value))?.uniteOperationnel || null);
               }}

               selectedKeys={selectedCommande ? [selectedCommande.toString()] : []}
               isInvalid={requestError?.commandeError !== null && requestError?.commandeError !== undefined}
               errorMessage={requestError?.commandeError}
            >
               {commandes!.map((com) => (
                  <SelectItem key={com.cmdeId} value={com.cmdeId}>
                     {com.lib_commande}
                  </SelectItem>
               ))}
            </Select>
            <div className="flex gap-4">
               <Input isDisabled value={emplacementDe ? emplacementDe: ''} type="text" label="De" validationBehavior="aria" radius="sm" size="md" variant="bordered" onChange={(e) => {

               }} />
               <Input type="text" value={unopA ? unopA : ''} isDisabled label="Vers" validationBehavior="aria" radius="sm" size="md" variant="bordered" />
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


            {/* <Divider className="my-4" />
         <h1 className="text-small text-default-400 ml-1">Service et Magasin</h1> */}
            <div className="w-3/6">
               <Button color="primary" variant="shadow" size="lg" className="h-[50px] " onPress={addMouvementSortie}>
                  Enregistrez les modifications
               </Button>
            </div>
         </div>

         <Table aria-label="Example static collection table" className="pt-5">
            <TableHeader columns={columns}>
               {(column) => (
                  <TableColumn key={column.key}>

                     {column.label.toLocaleUpperCase()}
                  </TableColumn>
               )}

            </TableHeader>
            <TableBody items={data!} emptyContent={"Aucune sortie"}>
               {(item) => (
                  <TableRow key={item[columns[0].key]} >
                     {(columnKey) => (
                        <TableCell className="text-sm">{getKeyValue(item, columnKey)}</TableCell>
                     )}
                  </TableRow>
               )}
            </TableBody>
         </Table>

      </div>
   </>
}