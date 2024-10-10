import CrudComponent from "@/components/features/crud-components"
import { createFamille, deleteFamille, getAllFamilles, updateFamille } from "@/services/api/article.service";
import { FamilleDataProps } from "@/types/types";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker } from "@nextui-org/date-picker";
import { Input } from "@nextui-org/input";
import { now, getLocalTimeZone, DateValue, fromDate, toZoned } from "@internationalized/date";


import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
export default function FamillePage() {
   const searchParams = new URLSearchParams(location.search);
   const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
   const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : 5;

   const [dateCreation, setDateCreation] = useState<DateValue>(now(getLocalTimeZone()))
   const [isNewRowAdded, setIsNewRowAdded] = useState(false);
   const [totalPage, setTotalPage] = useState<number>();
   const [label, setLabel] = useState('')

   const [requestError, setRequestError] = useState<any>(null)
   
   const [rowToUpdate, setRowToUpdate] = useState<number | null>(null);


   const navigate = useNavigate();



   const [data, setData] = useState<FamilleDataProps[] | null>([]);

   useEffect(() => {
      getAllFamilles({ page, size })
         .then((response) => {
            console.table(response)
            setData(response.familles);
            const realPage = Math.ceil(response.totalPages / size)
            setTotalPage(realPage)
         })
         .catch((error) => {
            toast.error('Erreur lors de la récupération des données ', error);
         })

   }, [page, size, isNewRowAdded]);

   useEffect(() => {
      if (rowToUpdate) {
         const row = data!.find((row: FamilleDataProps) => row.familleId === rowToUpdate)
         if (row) {
            setLabel(row.familleLi.trim())
            const calendarDate = fromDate(new Date(row.familleDtCr), "UTC")
            const dateValue = toZoned(calendarDate, "UTC")
            setDateCreation(dateValue)
         }

      }
   }, [rowToUpdate])


   const columns = [
      {
         key: 'familleId',
         label: 'Famille Id',
         type: 'integer'
      },
      {
         key: 'famLogRef',
         label: 'Reference',
         type: 'string'
      },
      {
         key: 'familleLi',
         label: 'Libellé',
         type: 'string'
      },

   ]

   const resetInput = () => {
      setLabel('')
      setRowToUpdate(null)
      setDateCreation(now(getLocalTimeZone()))
      setRequestError(null)

   }



   const createNewFamille = async () => {
      /* if (label.trim() === '') {
         setLabelError('Le libellé est obligatoire')
         return;
      } */
      await createFamille(label, dateCreation!.toDate(getLocalTimeZone()))
         .then((response) => {
            toast.success('Famille créée avec succès', response)
            setIsNewRowAdded(!isNewRowAdded)
         })
         .catch((error) => {
            if (error.response) {
               if (error.response.status === 400) {
                  setRequestError(error.response.data)
                  
               }
            }
         })

   }

   const onRowDelete = async (id: number) => {
      await deleteFamille(id)
         .then((response) => {
            console.log(response)
            setIsNewRowAdded(!isNewRowAdded)
            toast.success('Famille supprimée avec succès')
         })
         .catch((error) => {
            toast.error(error.data.error);
         })

   }

   const onRowUpdate = async () => {
      
      await updateFamille(rowToUpdate!, label, dateCreation!.toDate(getLocalTimeZone()))
         .then((response) => {
            toast.success('Famille modifiée avec succès', response)
            setIsNewRowAdded(!isNewRowAdded)
         })
         .catch((error) => {
            if (error.response) {
               if (error.response.status === 400) {
                  setRequestError(error.response.data)
               }
            }
         })
   }

   const onPageChange = (page: number) => {
      searchParams.set('page', page.toString());
      searchParams.set('size', size.toString());
      const updatedUrl = `${location.pathname}?${searchParams.toString()}`;

      navigate(updatedUrl)
   }


   return (
      <CrudComponent
         pageTitle="Famille"
         columns={columns}
         rowsData={data as Record<string, any>[]}
         onAdd={createNewFamille}
         onSearch={() => { }}
         pageIcon={<FontAwesomeIcon icon={faLayerGroup} />}
         pages={totalPage}
         initialPage={page}

         setRowToUpdate={setRowToUpdate}
         onRowDelete={onRowDelete}
         onPageChange={onPageChange}
         onRowUpdate={onRowUpdate}
         resetInput={resetInput}
         dataAbbreviation="famille"
         

         addModalContent={
            <div className="w-full flex flex-col gap-4 pb-5">
               
               <Input value={label} isInvalid={requestError?.familleLiError !== null && requestError?.familleLiError !== undefined} errorMessage={requestError?.familleLiError} type="text" label="Libellé" isRequired isClearable validationBehavior="aria" radius="sm" size="lg" onChange={(e) => setLabel(e.target.value)} />
               <DatePicker
                  label="Date de création"
                  hideTimeZone
                  showMonthAndYearPickers
                  value={dateCreation}
                  defaultValue={dateCreation}
                  radius="sm"
                  size="lg"
                  onChange={(e) => {
                     console.log(e)
                     setDateCreation(e)
                  }}
               />
            </div>
         }
      />
   )
}
