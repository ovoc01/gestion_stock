import CrudComponent from "@/components/features/crud-components"
import { createUnite, deleteUnite, getAllUnite, updateUnite } from "@/services/api/article.service";
import { UniteDataProps } from "@/types/types";
import { faRuler } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import { DatePicker } from "@nextui-org/date-picker";
import { Input } from "@nextui-org/input";
import { now, getLocalTimeZone, DateValue, fromDate, toZoned } from "@internationalized/date";
import { useNavigate } from "react-router-dom";

export default function UnitePage() {
   const searchParams = new URLSearchParams(location.search);
   const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
   const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : 5;
   const [totalPage, setTotalPage] = useState<number>();
   const [isNewRowAdded, setIsNewRowAdded] = useState(false);
   const [label, setLabel] = useState('')
   const [abbr, setAbbr] = useState('')
   const [dateCreation, setDateCreation] = useState<DateValue>(now(getLocalTimeZone()))
   //const [commentaire, setCommentaire] = useState('')
   const [isValidLabel, setIsValidLabel] = useState(false)
   const [rowToUpdate, setRowToUpdate] = useState<number | null>(null);


   const navigate = useNavigate();



   const [data, setData] = useState<UniteDataProps[] | null>([]);

   useEffect(() => {
      getAllUnite({ page, size })
         .then((response) => {
            console.table(response)
            setData(response.unites);
            const realPage = Math.ceil(response.totalPages / size)
            setTotalPage(realPage)
         })
         .catch((error) => {
            toast.error('Erreur lors de la récupération des données ', error);
         })
   }, [isNewRowAdded, page, size]);


   useEffect(()=>{
      if(rowToUpdate){
         const row = data!.find((row:UniteDataProps)=>row.uniteId === rowToUpdate)
         if(row){
            setLabel(row.uniteLi.trim())
            setAbbr(row.uniteAbrv.trim())
            const calendarDate = fromDate(new Date(row.uniteDtCr),"UTC")
            const dateValue = toZoned(calendarDate,"UTC")
            setDateCreation(dateValue)
            
         }
      }
   }
   ,[rowToUpdate])




   const columns = [
      {
         key: 'uniteId',
         label: 'Unité Id',
         type: 'integer'
      },
      {
         key: 'uniteLi',
         label: 'Libellé',
         type: 'string'
      },
      {
         key: 'uniteAbrv',
         label: 'Abbréviation',
         type: 'string'
      },

   ]

   const onRowDelete = async (id:number)=>{
      await deleteUnite(id)
      .then((response)=>{
         console.log(response)
         setIsNewRowAdded(!isNewRowAdded)
         toast.success('Unité supprimée avec succès')
      })
      
   }





   const createNewUnite = async () => {
      if (label === '') {
         setIsValidLabel(true)
         return
      }

      setIsValidLabel(false)
      await createUnite(label, abbr, dateCreation!.toDate(getLocalTimeZone()), '')
         .then((response) => {
            console.log(response)
            setIsNewRowAdded(!isNewRowAdded)
            toast.success('Unité ajoutée avec succès')
         })
         .catch((error) => {
            toast.error('Erreur lors de l\'ajout de l\'unité ', error);
         })
   };

   const onPageChange = (page: number) => {
      searchParams.set('page', page.toString());
      searchParams.set('size', size.toString());
      const updatedUrl = `${location.pathname}?${searchParams.toString()}`;

      navigate(updatedUrl)
   }

   const onRowUpdate = async ()=>{
      if(label === ''){
         setIsValidLabel(true)
         return
      }
      await updateUnite(rowToUpdate!,label,abbr,dateCreation!.toDate(getLocalTimeZone()),'')
      .then((response)=>{
         console.log(response)
         setIsNewRowAdded(!isNewRowAdded)
         toast.success('Unité modifiée avec succès')
      })
   }

   return (
      <CrudComponent
         pageTitle="Unité"
         columns={columns}
         rowsData={data as Record<string, any>[]}
         onAdd={createNewUnite}
         onSearch={() => { }}
         pageIcon={<FontAwesomeIcon icon={faRuler} />}
         initialPage={page}
         pages={totalPage}
         onPageChange={onPageChange}
         onRowDelete={onRowDelete}
         setRowToUpdate={setRowToUpdate}
         onRowUpdate={onRowUpdate}
         dataAbbreviation="unite"


         addModalContent={
            <div className="w-full flex flex-col gap-4 pb-5">
               <Input value={label} type="text" label="Libellé" isRequired isClearable validationBehavior="aria" radius="sm" size="lg" onChange={(e) => setLabel(e.target.value)} isInvalid={isValidLabel} />
               <Input value={abbr} type="text" label="Abréviation" isRequired isClearable validationBehavior="aria" radius="sm" size="lg" onChange={(e) => setAbbr(e.target.value)} />

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


