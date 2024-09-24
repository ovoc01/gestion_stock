
import { getAllArticles } from "@/services/api/article.service";
import { createMouvementSortie, getAllSorties } from "@/services/api/mouvement.service";
import { ArticleDataProps, RowData } from "@/types/types";
import { Input } from "@nextui-org/input";
import { Button, Divider, getKeyValue, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useEffect, useState } from "react";


export default function MouvementSortie() {

   const [data, setData] = useState<RowData[] | null>([])

   const [articles, setArticles] = useState<ArticleDataProps[] | null>([])

   const { page, size } = { page: 1, size: 5 }

   const [quantite, setQuantite] = useState<number | null>(null)
   const [prixUnitaire, setPrixUnitaire] = useState<number | null>(null)

   const [pageNeedReload, setPageNeedReload] = useState(false)

   const [selectedArticle, setSelectedArticle] = useState<number | null>(null)
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

   const addMouvementSortie = ()=>{
      createMouvementSortie(quantite!,prixUnitaire!,selectedArticle!,1)
      .then((response)=>{
            setPageNeedReload(!pageNeedReload)
            response
      }).catch((error)=>{
         console.log(error)
      })
   }

   return <>

      <div className="w-full flex flex-col gap-5 pt-5 justify-start">
         <div className="w-2/5 flex flex-col gap-3 pb-8 border-solid border-1  border-gray-300 rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-thin"></h1>
            <h1 className="text-small text-default-400 ml-1">Déplacement</h1>
            <div className="flex gap-4">
               <Input isDisabled value={"Batiment QHSE 1er étage"} type="text" label="De" validationBehavior="aria" radius="sm" size="md" variant="bordered" onChange={(e) => {

               }} />
               <Input type="text" value={"PK 13"} isDisabled label="Vers" validationBehavior="aria" radius="sm" size="md" variant="bordered" />
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
               >
                  {articles!.map((article) => (
                     <SelectItem key={article.artId} value={article.artId}>
                        {article.artLi}
                     </SelectItem>
                  ))}
               </Select>
            </div>
            <div className="flex  gap-4">
               <Input type="number" value={quantite ? quantite!.toString() :''} label="Quantite" validationBehavior="aria" radius="sm" size="md" variant="bordered" onChange={(e) => {
                  setQuantite(parseInt(e.target.value))
               }} />
               <Input type="number" value={prixUnitaire ? prixUnitaire!.toString():''} label="Prix unitaire" validationBehavior="aria"
                  radius="sm" size="md" variant="bordered"
                  onChange={(e) => {
                     setPrixUnitaire(parseInt(e.target.value))
                  }}
               />
            </div>
            <div className="flex w-full gap-4">
               <Input type="text"label="References" validationBehavior="aria" radius="sm" size="md" variant="bordered" onChange={(e) => {
                  
               }} />
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