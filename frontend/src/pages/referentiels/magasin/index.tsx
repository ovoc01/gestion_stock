import CrudComponent from "@/components/features/crud-components"
import { createMagasin, deleteMagasin, getAllMagasins, updateMagasin } from "@/services/api/batiment.service";
import { faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Input, Textarea } from "@nextui-org/input";
import { now, getLocalTimeZone, DateValue, fromDate, toZoned } from "@internationalized/date";
import { DatePicker } from "@nextui-org/date-picker";
import { useLocation, useNavigate } from "react-router-dom";
import { MagasinDataProps } from "@/types/types";

export default function MagasinPage() {
   const [label, setLabel] = useState('')
   const [dateCreation, setDateCreation] = useState<DateValue>(now(getLocalTimeZone()))
   const [commentaire, setCommentaire] = useState('')

   const [isNewRowAdded, setIsNewRowAdded] = useState(false);
   const [totalPage, setTotalPage] = useState<number>();

   const location = useLocation();
   const navigate = useNavigate();

   const [requestError, setRequestError] = useState<any>(null)


   const [data, setData] = useState<MagasinDataProps[] | null>([]);
   const searchParams = new URLSearchParams(location.search);
   const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
   const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : 5;
   const idMagasin = searchParams.get('idMagasin') ? parseInt(searchParams.get('idMagasin')!) : null;

   const [rowToUpdate, setRowToUpdate] = useState<number | null>(null);


   useEffect(() => {
      getAllMagasins({ page, size })
         .then((response) => {
            console.table(response)
            setData(response.magasins);
            const realPage = Math.ceil(response.totalPages / size)
            setTotalPage(realPage)
         })
         .catch((error) => {
            toast.error('Erreur lors de la récupération des données ', error);
         })

   }, [isNewRowAdded, page, size]);

   useEffect(() => {
      if (rowToUpdate) {

         const row = data!.find((row: MagasinDataProps) => row.magId === rowToUpdate);
         if (row) {
            setLabel(row.magLi)
            const calendarDate = fromDate(new Date(row.magDtCr), "UTC");
            const dateValue = toZoned(calendarDate, "UTC");
            setDateCreation(dateValue)
            setCommentaire(row.magCom ? row.magCom : '')
         }
      }
   }, [rowToUpdate])


   const columns = [
      {
         key: 'magId',
         label: 'Magasin Id',
         type: 'integer'
      },
      {
         key: 'magLi',
         label: 'Libellé',
         type: 'string'
      },
      {
         key: 'magResp',
         label: 'Responsable'
      },
      {
         key: 'magDtCr',
         label: 'Date de création',
      }

   ]



   const onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLabel(e.target.value)
   }


   const createNewFamille = async () => {
      
      console.log(dateCreation)
      await createMagasin(label, dateCreation!.toDate(getLocalTimeZone()), commentaire)
         .then((response) => {
            toast.success(response.message)
            setIsNewRowAdded(!isNewRowAdded)
            setLabel('')
            setCommentaire('')
         }).catch((error)=>{
            if(error.response){
               if(error.response.status  === 400){
                  setRequestError(error.response.data)
               }
            }
         })
   };

   const onRowDelete = async (id: number) => {
      await deleteMagasin(id)
         .then((response) => {
            toast.success(response.message)
            setIsNewRowAdded(!isNewRowAdded)
         })
   }

   const onRowUpdate = async () => {
      
      await updateMagasin(rowToUpdate!, label, dateCreation!.toDate(getLocalTimeZone()), commentaire)
         .then((response) => {
            toast.success(response.message)
            setIsNewRowAdded(!isNewRowAdded)
            setRowToUpdate(null)
            setLabel('')
            setCommentaire('')
         }).catch((error)=>{
            if(error.response){
               if(error.response.status  === 400){
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


   const resetInput = ()=>{
      setLabel('')
      setCommentaire('')
      setRowToUpdate(null)
      setRequestError(null)
   }
   return (
      
      <CrudComponent
         pageTitle="Magasin"
         columns={columns}
         rowsData={data as Record<string, any>[]}
         isDeleteAuthorized
         isUpdateAuthorized
         pageIcon={<FontAwesomeIcon icon={faWarehouse} />}
         initialPage={page}
         pages={totalPage}
         resetInput={resetInput}

         onSearch={() => { }}
         onPageChange={onPageChange}
         onAdd={createNewFamille}
         onRowDelete={onRowDelete}
         setRowToUpdate={setRowToUpdate}
         onRowUpdate={onRowUpdate}
         dataAbbreviation="mag"

         addModalContent={
            <div className="w-full flex flex-col justify-center gap-4 align-center min-h-[170px] pb-5">
               <Input value={label}  type="text" label="Libellé" isRequired isClearable validationBehavior="aria" radius="sm" size="lg" 
               onChange={(e) => onLabelChange(e)} isInvalid={requestError?.magLiError !==null && requestError?.magLiError !==undefined } errorMessage={requestError?.magLiError} />
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
               <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                  <Textarea
                     value={commentaire}
                     label="Commentaire"
                     onChange={(e) => setCommentaire(e.target.value)}
                  />
               </div>
            </div>
         }
      />
   )
}