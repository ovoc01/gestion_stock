
import { getAllEmplacements } from "@/services/api/batiment.service";
import { createCommande } from "@/services/api/mouvement.service";
import { getAllUniteOperationnel } from "@/services/api/uniteOperationnel.service";
import { EmplacementDataProps, UniteOperationnelDataProps } from "@/types/types";
import { Button, getKeyValue, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export default function Commande() {
   const [unOp, setUnOp] = useState<UniteOperationnelDataProps[] | null>([])
   const [emplacements, setEmplacements] = useState<EmplacementDataProps[] | null>([])
   const [requestError, setRequestError] = useState('')
   
   const { page, size } = { page: 1, size: 5 }
   useEffect(() => {
      getAllUniteOperationnel({ page, size })
      .then((response) => {
         setUnOp(response.uniteOperationnels)
      })
      .catch((error) => {
         toast.error('Erreur lors de la récupération des données ', error);
      })
      
      getAllEmplacements({ page, size })
      .then((response) => {
         setEmplacements(response.emplacements)
      }).catch((error) => {
         toast.error('Erreur lors de la récupération des données ', error);
      })
      
   }, [])

   
   
   const [emplId, setEmplId] = useState<number | null>(null)
   const [unopId, setUnopId] = useState<number | null>(null)
   const [commandes, setCommandes] = useState([])

   const createNewCommande = () => {
      createCommande(emplId!, unopId!)
         .then((response) => {
            toast.success('Nouvelle commande enregistrer', response)
         }).catch((error) => {
            setRequestError(error.response.data.error)
         })
   }


   const columns = [
      {
         key: 'cmdeId',
         label: 'ID',
         sortable: true
      },
      {
         key: 'article',
         label: 'De',
         sortable: true
      },
      {
         key: 'code',
         label: 'Vers',
         sortable: true
      },
   ]

   return <>
      <div className="w-full flex flex-col gap-5 pt-5 ">
         <div className="w-2/5 flex flex-col gap-4 pb-8 border-solid border-1  border-gray-300 rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-thin">Création nouvelle commande</h1>
            <h1 className="text-small text-default-400 ml-1">Unité operationnel concernés</h1>
            <div className="flex gap-4">
               <Select
                  variant="bordered"
                  label="De"
                  size="sm"
                  selectedKeys={emplId ? emplId.toString() : []}
                  onChange={(e) => {
                     setEmplId(parseInt(e.target.value))
                  }}
               >
                  {emplacements!.map((u) => (
                     <SelectItem key={u.emplId} value={u.emplId}>
                        {u.emplLi}
                     </SelectItem>
                  ))}

               </Select>
               <Select
                  variant="bordered"
                  label="À"
                  size="sm"
                  selectedKeys={unopId ? unopId.toString() : []}
                  onChange={(e) => {
                     setUnopId(parseInt(e.target.value))
                  }}
               >
                  {unOp!.map((u) => (
                     <SelectItem key={u.unopId} value={u.unopId}>
                        {u.unopLi}
                     </SelectItem>
                  ))}

               </Select>
            </div>
            <h1 className="text-sm " color="danger">
               {requestError}
            </h1>


            {/* <Divider className="my-4" />
         <h1 className="text-small text-default-400 ml-1">Service et Magasin</h1> */}
            <div className="w-3/6">
               <Button color="primary" variant="shadow"
                  size="lg" className="h-[30px] rounded-md "
                  onClick={createNewCommande}
               >
                  Enregistrer
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
            <TableBody emptyContent={"Aucune sortie"}>
               {[]}
            </TableBody>
         </Table>

      </div>
   </>
}