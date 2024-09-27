import CrudComponent from "@/components/features/crudComponents"
import { createServiceExploitant, getAllServiceExploitant } from "@/services/api/serviceExploitant.service";
import { ServiceExploitantDataProps } from "@/types/types";
import { faBuildingShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
export default function ServiceExploitantPage() {
   const searchParams = new URLSearchParams(location.search);
   const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
   const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : 5;

   const [label, setLabel] = useState('')
   const [numbu, setNumbu] = useState<string | null>('')
   const [totalPage, setTotalPage] = useState<number>();

   const [isNewRowAdded, setIsNewRowAdded] = useState(false);


   const [requestError, setRequestError] = useState<any>(null)



   const [data, setData] = useState<ServiceExploitantDataProps[] | null>([]);

   useEffect(() => {
      getAllServiceExploitant({ page, size })
         .then((response) => {
            setData(response.serviceExploitants)
            const realPage = Math.ceil(response.totalPages / size)
            setTotalPage(realPage)
            setTotalPage(realPage)
         })
         .catch((error) => {
            toast.error('Erreur lors de la récupération des données ', error);
         })

   }, [isNewRowAdded, page, size]);


   const columns = [
      {
         key: 'serviceId',
         label: 'Service Id',
         type: 'integer'
      },
      {
         key: 'serviceLi',
         label: 'Libellé',
         type: 'string'
      },
      {
         key: 'serviceNumBu',
         label: 'Numéro BU',
         type: 'string'
      },

      {
         key: 'serviceDtCr',
         label: 'Date Création',
         type: 'string'
      },

   ]


   const createNewService = () => {
      
      createServiceExploitant(label, numbu!)
         .then(() => {
            toast.success('Service exploitant ajouté avec succès')
            setLabel('')
            setNumbu(null)
            setIsNewRowAdded(!isNewRowAdded)
         })
         .catch((error) => {
            if (error.response) {
               setRequestError(error.response.data)
            }
         })
   };

   return (
      <CrudComponent
         pageTitle="Service exploitant"
         columns={columns}
         rowsData={data as Record<string, any>[]}
         onAdd={createNewService}
         onSearch={() => { }}
         pageIcon={<FontAwesomeIcon icon={faBuildingShield} />}
         pages={totalPage}
         initialPage={page}
         dataAbbreviation="service"

         addModalContent={
            <div className="w-full flex flex-col gap-4 pb-5" >
               <Input value={label} type="text" isInvalid={requestError?.serviceLiError !== null && requestError?.serviceLiError !== undefined} errorMessage={requestError?.serviceLiError} label="Libellé" isRequired isClearable validationBehavior="aria" radius="sm" size="lg" onChange={(e) => setLabel(e.target.value)} />
               <Input value={numbu!} isInvalid={requestError?.serviceNumBuError !== null && requestError?.serviceNumBuError !== undefined} errorMessage={requestError?.serviceNumBuError} type="text" label="Numéro BU" isRequired isClearable validationBehavior="aria" radius="sm" size="lg" onChange={(e) => setNumbu(e.target.value)} />
            </div>
         }
      />
   )
}
