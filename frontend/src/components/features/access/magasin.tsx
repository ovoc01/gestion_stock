import { DefaultTable } from "@/components/ui/table/default";
import { addUtilisateurToMagasin, getAllMagasins, getAllUtilisateurMagasins } from "@/services/api/batiment.service";
import { FetchType } from "@/shared/shared";
import { MagasinDataProps, RowData, UserInfoProps } from "@/types/types";
import { Button } from "@nextui-org/button";
import { DatePicker } from "@nextui-org/date-picker";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { getLocalTimeZone, fromDate, DateValue } from "@internationalized/date";

type UserMagasinAccessProps = {
   chipClassName?: Record<string, string>[]
}

export function UserMagasinAccess({ chipClassName }: UserMagasinAccessProps) {
   //hooks initialisation

   const location = useLocation();
   const user = location.state as UserInfoProps;
   //state
   const [usrMagasins, setUsrMagasins] = useState<RowData[] | null>([]);
   const [userDetails] = useState<UserInfoProps>(user);
   const [magasins, setMagasins] = useState<MagasinDataProps[] | null>(null);
   const [magasin, setMagasin] = useState<number>()
   const [isDbActionDone, setIsDbAction] = useState(false)
   const [dateDebut, setDateDebut] = useState<DateValue>(fromDate(new Date(), getLocalTimeZone()))
   const [requestError, setRequestError] = useState<any>(null);

   //static data
   const magasinColumns = [
      {
         key: 'magId',
         label: 'Identifiant Magasin'
      },
      {
         key: 'magLi',
         label: 'Libellé'
      },
      {
         key: 'depuis',
         label: 'Date Affectation'
      },
      {
         key: 'depuis',
         label: 'Date Début'
      },
      {
         key: 'jusqua',
         label: 'Date fin'
      },
      {
         key: 'status',
         label: 'Status',
         isChip: true
      },
      {
         key: 'durée',
         label: 'Durée (en jours)'
      }
   ]
   const { page, size } = { page: 1, size: 5 };

   //useEffect call
   useEffect(() => {
      getAllUtilisateurMagasins(userDetails.usrId).then((response) => {
         const d = response.magasins as Record<string, any>[];
         console.log(usrMagasins)
         setUsrMagasins(d);
      });
      getAllMagasins({ page, size, fetch: FetchType.ALL })
         .then((response) => {
            setMagasins(response.magasins);
         })
         .catch((error) => {
            console.error("Erreur lors de la récupération des données ", error);
         });
   }, [isDbActionDone])

   //function
   const onMagasinChange = (item: any) => {
      if (item) {
         setMagasin(parseInt(item.toString()))
      }
   }


   const onMagasinAdd = async () => {
      await addUtilisateurToMagasin(userDetails.usrId, magasin!, dateDebut!.toDate(getLocalTimeZone()))
         .then(() => {
            toast.info("Modification fait")
            setIsDbAction(!isDbActionDone)
         })
         .catch((error) => {
            setRequestError(error.response.data)
         })
   }

   return <>
      <h1 className="text-3xl mb-3">Modification accès magasins</h1>
      <div className="w-3/6 mb-5 flex flex-col gap-3 border-solid border-1 p-5 rounded-md shadow-md">
         <div>
            <h1 className="text-small text-default-400 ml-1 mb-2">Magasins</h1>
            <Autocomplete variant="bordered" radius="sm"
               errorMessage={requestError?.magIdError}
               isInvalid={requestError?.magIdError !== null && requestError?.magIdError !== undefined}
               onSelectionChange={(item) => onMagasinChange(item)}
               listboxProps={{
                  emptyContent: 'Aucun magasin retrouvé',
               }}
            >
               {/* {(item) => (<AutocompleteItem key={item.magId}>{item.magLi}</AutocompleteItem>)} */}
               {
                  magasins ? (
                     magasins!.map((mag) => (
                        <AutocompleteItem key={mag.magId}>{mag.magLi}</AutocompleteItem>
                     ))
                  ) : []
               }
            </Autocomplete>
         </div>
         <div className="flex gap-4 ">
            <div className="w-3/6">
               <h1 className="text-small text-default-400 ml-1 mb-2">Début</h1>
               <DatePicker
                  value={dateDebut}
                  variant="bordered"
                  radius="sm" isRequired
                  errorMessage={requestError?.debutError}
                  onChange={(date) => setDateDebut(date)}
                  granularity="day"
               />
            </div>
            <div className="w-3/6">
               <h1 className="text-small text-default-400 ml-1 mb-2">Fin</h1>
               <DatePicker
                  variant="bordered" radius="sm"
                  granularity="day"
               />
            </div>
         </div>
         <div className="w-3/6 ">
            <Button size="sm" className="p-3 w-[150px]" color="primary" onPress={onMagasinAdd}>
               Validez
            </Button>
         </div>
      </div>
      <DefaultTable headers={magasinColumns} data={usrMagasins!} chipClassName={chipClassName} />

   </>
}