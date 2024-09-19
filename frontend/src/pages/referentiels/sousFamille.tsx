import CrudComponent from "@/components/crudComponents"
import { createSousFamille, deleteSousFamille, getAllFamilles, getAllSousFamilles, updateSousFamille } from "@/services/api/article.service";
import { FamilleDataProps, SousFamilleDataProps } from "@/types/types";
import { faCube } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  Input, Select, SelectItem } from "@nextui-org/react";
import { now, getLocalTimeZone, DateValue, fromDate, toZoned } from "@internationalized/date";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function SousFamillePage() {
   const searchParams = new URLSearchParams(location.search);
   const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
   const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : 5;
   const [rowToUpdate, setRowToUpdate] = useState<number | null>(null);

   const [totalPage, setTotalPage] = useState<number>();
   const [label, setLabel] = useState('')
   const [familleId, setFamilleId] = useState<number | null>(0)
   const [dateCreation, setDateCreation] = useState<DateValue>(now(getLocalTimeZone()))
   const [isNewRowAdded, setIsNewRowAdded] = useState(false);

   const navigate = useNavigate();



   const [data, setData] = useState<SousFamilleDataProps[] | null>([]);

   const [familles, setFamilles] = useState<FamilleDataProps[] | null>([]);

   useEffect(() => {
      console.log("response 2")
      getAllFamilles({ page, size })
         .then((response) => {
            console.log("response")
            setFamilles(response.familles)
         })
         .catch((error) => {
            toast.error('Erreur lors de la récupération des données ', error);
         })
   }, []);

   useEffect(() => {
      getAllSousFamilles({ page, size })
         .then((response) => {
            setData(response.sousFamilles);
            const realPage = Math.ceil(response.totalPages / size)
            setTotalPage(realPage)
         }
         )
   }, [page, size, isNewRowAdded])

   useEffect(() => {
      if (rowToUpdate) {
         console.log("rowToUpdate", rowToUpdate)
         const row = data!.find((row: SousFamilleDataProps) => row.sousFamId === rowToUpdate)
         if (row) {
            setLabel(row.sousFamLi.trim())
            setFamilleId(row.familleId)
            const calendarDate = fromDate(new Date(row.sousFamDtCr), "UTC")
            const dateValue = toZoned(calendarDate, "UTC")
            setDateCreation(dateValue)
         }
      }
   }, [rowToUpdate])


   const columns = [
      {
         key: 'sousFamId',
         label: 'Sous Famille Id',
         type: 'integer'
      },
      {
         key: 'familleLi',
         label: 'Famille',
         type: 'string'
      },
      {
         key: 'sousFamLi',
         label: 'Libellé',
         type: 'string'
      },
      {
         key: 'sousFamDtCr',
         label: 'Date de création',
         type: 'string'
      }
   ]





   const createSousNewFamille = async () => {
      if (label.trim() === '') {
         toast.error('Le libellé est obligatoire')
         return;
      }

      await createSousFamille(familleId!, label, dateCreation!.toDate(getLocalTimeZone()))
         .then(() => {
            toast.success('La sous famille a été ajoutée avec succès')
            setLabel('')
            setFamilleId(null)
            setDateCreation(now(getLocalTimeZone()))
            setIsNewRowAdded(!isNewRowAdded)
         })

   };

   const onRowDelete = async (id: number) => {
      await deleteSousFamille(id)
         .then((response) => {
            console.log(response)
            setIsNewRowAdded(!isNewRowAdded)
            toast.success('Sous Famille supprimée avec succès')
         }).catch((error) => {
            toast.error('Erreur lors de la suppression de la sous famille ', error);
         })
   }

   const onPageChange = (page: number) => {
      searchParams.set('page', page.toString());
      searchParams.set('size', size.toString());
      const updatedUrl = `${location.pathname}?${searchParams.toString()}`;
      navigate(updatedUrl)
   }

   const onRowUpdate = async () => {
      if (label.trim() === '') {
         toast.error('Le libellé est obligatoire')
         return;
      }
      await updateSousFamille(rowToUpdate!, familleId!, label, dateCreation!.toDate(getLocalTimeZone()))
         .then(() => {
            toast.success('Sous Famille modifiée avec succès')
            setIsNewRowAdded(!isNewRowAdded)
            setRowToUpdate(null)
         }).catch((error) => {
            toast.error('Erreur lors de la modification de la sous famille ', error);
         })
   }

   const resetInput = () => {
      setLabel('')
      setFamilleId(null)
      setDateCreation(now(getLocalTimeZone()))
   }

   return (
      <CrudComponent
         pageTitle="Sous Famille"
         columns={columns}
         rowsData={data as Record<string, any>[]}
         isDeleteAuthorized
         isUpdateAuthorized
         onAdd={createSousNewFamille}
         onSearch={() => { }}
         pageIcon={<FontAwesomeIcon icon={faCube} />}
         pages={totalPage}
         initialPage={page}
         onRowDelete={onRowDelete}
         onPageChange={onPageChange}
         onRowUpdate={onRowUpdate}
         setRowToUpdate={setRowToUpdate}
         resetInput={resetInput}
         dataAbbreviation="sousFam"

         addModalContent={
            <div className="w-full flex flex-col gap-4 pb-5">
               <Input value={label} onChange={(e) => setLabel(e.target.value)} type="text" label="Libellé" isRequired isClearable validationBehavior="aria" radius="sm" size="lg" />
               <Select

                  label="Listes des Familles"
                  onChange={(e) => {
                     setFamilleId(parseInt(e.target.value))
                  }}

                  selectedKeys={familleId ? [familleId.toString()] : []}

               >
                  {familles!.map((famille) => (
                     <SelectItem key={famille.familleId} value={famille.familleId}>
                        {famille.familleLi}
                     </SelectItem>
                  ))}
               </Select>

            </div>
         }
      />
   )
}
