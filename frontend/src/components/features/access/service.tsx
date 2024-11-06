import { DefaultTable } from "@/components/ui/table/default";
import { addUserToService, getAllServiceExploitant, getAllUsrServiceExploitant } from "@/services/api/service-exploitant.service";
import { FetchType } from "@/shared/shared";
import { RowData, ServiceExploitantDataProps, UserInfoProps } from "@/types/types";
import { Button } from "@nextui-org/button";
import { DatePicker } from "@nextui-org/date-picker";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getLocalTimeZone, fromDate, DateValue } from "@internationalized/date";
import { toast } from "sonner";

type UserServiceAccessProps = {
   chipClassName?: Record<string, string>[]
}

export function UserServiceAccess({ chipClassName }: UserServiceAccessProps) {
   //hooks
   const location = useLocation();
   const user = location.state as UserInfoProps;

   //state
   const [services, setServices] = useState<ServiceExploitantDataProps[] | null>(
      [],
   );
   const [usrServiceExploitant, setUsrServiceExploitant] = useState<
      RowData[] | null
   >([]);

   const [userDetails] = useState<UserInfoProps>(user);
   const [service, setService] = useState<number>()
   const [requestError, setRequestError] = useState<any>(null);
   const [dateDebut, setDateDebut] = useState<DateValue>(fromDate(new Date(), getLocalTimeZone()))
   const [isDbActionDone, setIsDbAction] = useState(false)




   const magasinColumns = [
      {
         key: 'serviceId',
         label: 'Identifiant Service'
      },
      {
         key: 'serviceLi',
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
   //useEffect
   useEffect(() => {
      getAllServiceExploitant({ page, size, fetch: FetchType.ALL })
         .then((response) => {
            setServices(response.serviceExploitants);
         })
         .catch((error) => {
            console.error("Erreur lors de la récupération des données ", error);
         });

      getAllUsrServiceExploitant(userDetails.usrId)
         .then((response) => {
            const d = response.services as Record<string, any>[];
            usrServiceExploitant
            setUsrServiceExploitant(d);
         })
         .catch((error) => {
            console.error("Erreur lors de la récupération des données ", error);
         });
   }, [isDbActionDone])

   //function
   const onServiceChange = (item: any) => {
      if (item) {
         setService(parseInt(item.toString()))
      }
   }

   const onServiceAdd = async () => {
      await addUserToService(userDetails.usrId, service!, dateDebut!.toDate(getLocalTimeZone()))
         .then(() => {
            toast.info("Modification fait")
            setIsDbAction(!isDbActionDone)
         })
         .catch((error) => {
            setRequestError(error.response.data)
            if (requestError.error) {
               toast.error(requestError.error)
            }
         })
   }

   return <>
      <h1 className="text-3xl mb-3">Modification accès services</h1>
      <div className="w-3/6 mb-5 flex flex-col gap-3 border-solid border-1 p-5 rounded-md shadow-md">
         <div>
            <h1 className="text-small text-default-400 ml-1 mb-2">Services</h1>
            <Autocomplete variant="bordered" radius="sm"
               errorMessage={requestError?.serviceIdError}
               isInvalid={requestError?.serviceIdError !== null && requestError?.serviceIdError !== undefined}
               onSelectionChange={(item) => onServiceChange(item)}
               listboxProps={{
                  emptyContent: 'Aucun service  retrouvé',
               }}
            >
               {
                  services ? (
                     services!.map((serv) => (
                        <AutocompleteItem key={serv.serviceId}>{serv.serviceLi}</AutocompleteItem>
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
                  granularity="day"
                  radius="sm" isRequired
                  isInvalid={requestError?.debutError !== null && requestError?.debutError !== undefined}
                  errorMessage={requestError?.debutError}
                  onChange={(date) => setDateDebut(date)}

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
            <Button size="sm" className="p-3 w-[150px]" color="primary" onPress={onServiceAdd}>
               Validez
            </Button>
         </div>
      </div>
      <DefaultTable headers={magasinColumns} data={usrServiceExploitant!} chipClassName={chipClassName} />

   </>
}