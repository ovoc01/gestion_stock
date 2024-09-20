import CrudComponent from "@/components/crudComponents"
import { createUniteOperationnel, deleteUniteOperationnel, getAllUniteOperationnel, updateUniteOperationnel } from "@/services/api/uniteOperationnel.service";
import { UniteOperationnelDataProps } from "@/types/types";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Map from "@/components/map";

import { Input } from "@nextui-org/input";

import { useEffect, useState } from "react";
import { toast } from "sonner";
export default function UniteOperationnelPage() {
   const searchParams = new URLSearchParams(location.search);
   const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
   const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : 5;

   const [label, setLabel] = useState('')
   const [numbu, setNumbu] = useState<string | null>('')
   const [buli, setBuli] = useState<string | null>('')
   const [numAffaire, setNumAffaire] = useState<string | null>('')
   const [mdmId, setMdmId] = useState<string | null>('')

   const [totalPage, setTotalPage] = useState<number>();
   const [isNewRowAdded, setIsNewRowAdded] = useState(false);
   const [rowToUpdate, setRowToUpdate] = useState<number | null>(null);

   const [data, setData] = useState<UniteOperationnelDataProps[] | null>([]);

   useEffect(() => {
      const fetchData = async () => {
         await getAllUniteOperationnel({ page, size })
            .then((response) => {
               setData(response.uniteOperationnels)
               setTotalPage(Math.ceil(response.totalPages / size))
            })
      }

      fetchData();

   }, [isNewRowAdded, page, size]);

   useEffect(() => {
      if (rowToUpdate) {
         const row = data!.find((row: UniteOperationnelDataProps) => row.unopId === rowToUpdate)
         console.log(row)
         if (row) {
            setLabel(row.unopLi.trim())
            setNumbu(row.unopNumBu)
            setBuli(row.unopLiNumAff)
            setNumAffaire(row.unopLiNumAff)
            setMdmId(row.unopMdmId)
         }
      }
   }, [rowToUpdate])


   const columns = [
      {
         key: 'unopId',
         label: 'Unité operationnel ID',
         type: 'integer'
      },
      {
         key: 'unopRef',
         label: 'Reference',
         type: 'string'
      },
      {
         key: 'unopNumBu',
         label: 'Numéro Bu',
         type: 'integer'
      },
      {
         key: 'unopLi',
         label: 'Libéllé',
         type: 'string'
      },
      {
         key: 'unopLiNumAff',
         label: 'Numero Affaire',
         type: 'string'
      }
   ]



   const createNewUnOp = () => {
      if (label === '' || numbu === '' || buli === '' || numAffaire === '' || mdmId === '') {
         return
      }
      createUniteOperationnel(numbu!, buli!, numAffaire!, mdmId!, label!)
         .then(() => {
            setIsNewRowAdded(!isNewRowAdded)
            toast.message('Unité operationnel ajoutée')
         }).catch((error) => {
            toast.error(error)
         })
   };

   const resetInput = () => {
      setLabel('')
      setNumbu('')
      setBuli('')
      setNumAffaire('')
      setMdmId('')
      setRowToUpdate(null)
   }

   const onRowDelete = (unopId: number) => {
      deleteUniteOperationnel(unopId)
         .then(() => {
            toast.message('Unité operationnel supprimée')
            setIsNewRowAdded(!isNewRowAdded)
         })
         .catch((error) => {
            toast.error('Erreur lors de la suppression de l\'unité operationnel', error)
         })
   }

   const onRowUpdate = () => {
      if (label === '' || numbu === '' || buli === '' || numAffaire === '' || mdmId === '') {
         return
      }
      updateUniteOperationnel(rowToUpdate!, numbu!, buli!, numAffaire!, mdmId!, label!)
         .then(() => {
            setIsNewRowAdded(!isNewRowAdded)
            toast.message('Unité operationnel modifiée')
            setRowToUpdate(null)
         })
         .catch((error) => {
            toast.error('Erreur lors de la modification de l\'unité operationnel', error)
         })
   }

   return (
      <CrudComponent
         pageTitle="Unité operationnel"
         columns={columns}
         rowsData={data as Record<string, any>[]}
         onAdd={createNewUnOp}
         onSearch={() => { }}
         pageIcon={<FontAwesomeIcon icon={faBuilding} />}
         dataAbbreviation="unop"
         resetInput={resetInput}
         onRowDelete={onRowDelete}
         onRowUpdate={onRowUpdate}
         setRowToUpdate={setRowToUpdate}
         pages={totalPage}
         isDeleteAuthorized
         isUpdateAuthorized
         size="2xl"
         extraComponent={
            <Map/>
         }

         addModalContent={
            <div className="w-full flex flex-col gap-4 ">
               <Input value={label} type="text" label="Nom unité operationnel" isRequired variant="bordered" onChange={(e) => setLabel(e.target.value)} />
               <Input value={numbu!} type="text" label="Numero bu" isRequired variant="bordered" onChange={(e) => setNumbu(e.target.value)} />
               <Input value={buli!} type="text" label="Libéllé bu" isRequired variant="bordered" onChange={(e) => setBuli(e.target.value)} />
               <Input value={numAffaire!} type="text" label="Numero affaire" isRequired variant="bordered" onChange={(e) => setNumAffaire(e.target.value)} />
               <Input value={mdmId!} type="text" label="Mdm id" isRequired variant="bordered" onChange={(e) => setMdmId(e.target.value)} />
            </div>
         }
      />
   )
}
