import CrudComponent from "@/components/features/crudComponents"
import { PeriodeDataProps } from "@/types/types";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker } from "@nextui-org/date-picker";
import { Input } from "@nextui-org/input";
import { now, getLocalTimeZone, DateValue, fromDate, toZoned } from "@internationalized/date";


import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createPeriode, getAllPeriodes, updatePeriode } from "@/services/api/mouvement.service";

export default function PeriodePage() {
   const searchParams = new URLSearchParams(location.search);
   const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
   const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : 5;

   const [dateCreation, setDateCreation] = useState<DateValue>(now(getLocalTimeZone()))
   const [dateFin, setDateFin] = useState<DateValue | null>(null)
   const [isNewRowAdded, setIsNewRowAdded] = useState(false);
   const [totalPage, setTotalPage] = useState<number>();
   const [label, setLabel] = useState('')
   const [rowToUpdate, setRowToUpdate] = useState<number | null>(null);


   const navigate = useNavigate();



   const [data, setData] = useState<PeriodeDataProps[] | null>([]);

   useEffect(() => {
      getAllPeriodes({ page, size })
         .then((response) => {

            setData(response.periodes);
            const realPage = Math.ceil(response.totalPages / size)
            setTotalPage(realPage)
         })
         .catch((error) => {
            toast.error('Erreur lors de la récupération des données ', error);
         })

   }, [page, size, isNewRowAdded]);

   useEffect(() => {
      if (rowToUpdate) {

         const row = data!.find((row: PeriodeDataProps) => row.periodeId === rowToUpdate);
         if (row) {
            setLabel(row.periodeLi)
            const calendarDate = fromDate(new Date(row.periodeDtDb), "UTC");
            const dateValue = toZoned(calendarDate, "UTC");
            setDateCreation(dateValue)
         }
      }
   }, [rowToUpdate])


   const columns = [
      {
         key: 'periodeId',
         label: 'Periode Id',
         type: 'integer'
      },

      {
         key: 'periodeLi',
         label: 'Libellé',
         type: 'string'
      },
      {
         key: 'periodeDtDb',
         label: 'Date de début',
         type: 'string'
      },
      {
         key: 'periodeDtFin',
         label: 'Date de fin',
         type: 'string'
      },
      {
         key: 'periodeEtat',
         label: 'Etat',
         type: 'string'
      }

   ]

   const resetInput = () => {

      setRowToUpdate(null)
   }



   const onRowAdd = async () => {
      const periode = {
         periodeLi: label,
         periodeDtDb: dateCreation,
      }

      createPeriode(periode.periodeLi, dateCreation!.toDate(getLocalTimeZone()))
         .then((response) => {
            toast.success('Période ajoutée avec succès', response)
            setIsNewRowAdded(!isNewRowAdded)
         })
         .catch((error) => {
            toast.error('Erreur lors de l\'ajout de la période', error)
         })
   }



   const onRowUpdate = async () => {
      updatePeriode(rowToUpdate!, label,dateCreation!.toDate(getLocalTimeZone()), dateFin!.toDate(getLocalTimeZone()))
         .then((response) => {
            toast.success('Période modifiée avec succès', response)
            setIsNewRowAdded(!isNewRowAdded)
            setRowToUpdate(null)
         })
         .catch((error) => {
            toast.error('Erreur lors de la modification de la période', error)
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
         pageTitle="Periodes"
         columns={columns}
         rowsData={data as Record<string, any>[]}
         onAdd={onRowAdd}
         onSearch={() => { }}
         pageIcon={<FontAwesomeIcon icon={faLayerGroup} />}
         pages={totalPage}
         initialPage={page}
         onPageChange={onPageChange}
         onRowUpdate={onRowUpdate}
         setRowToUpdate={setRowToUpdate}
         resetInput={resetInput}
         isUpdateAuthorized
         isCustomActionAuthorized


         //isActionAuthorized

         dataAbbreviation="periode"

         addModalContent={
            <div className="w-full flex flex-col gap-4 pb-5">
               <Input value={label} type="text" label="Libellé" isRequired isClearable validationBehavior="aria" radius="sm" size="lg" onChange={(e) => setLabel(e.target.value)} />
               <DatePicker
                  label="Date de debut période"
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
                  isDisabled={rowToUpdate !== null}

               />
               <DatePicker
                  label="Date de debut fin"
                  hideTimeZone
                  showMonthAndYearPickers
                  value={dateFin}
                  isDisabled={rowToUpdate === null}
                  radius="sm"
                  size="lg"
                  onChange={(e) => {
                     console.log(e)
                     setDateFin(e)
                  }}
               />
            </div>
         }
      />
   )
}
