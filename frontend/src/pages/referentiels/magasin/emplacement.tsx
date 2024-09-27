import CrudComponent from "@/components/features/crudComponents"
import { createEmplacement, deleteEmplacement, getAllEmplacements, getAllMagasins, updateEmplacement } from "@/services/api/batiment.service";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { EmplacementDataProps, MagasinDataProps, ServiceExploitantDataProps } from "@/types/types";
import { getAllServiceExploitant } from "@/services/api/serviceExploitant.service";
import { Input, Select, SelectItem } from "@nextui-org/react";
export default function EmplacementPage() {
   const searchParams = new URLSearchParams(location.search);
   const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
   const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : 5;
   const [label, setLabel] = useState('')
   const [magId, setMagId] = useState<number | null>(null)
   const [serviceId, setServiceId] = useState<number | null>(null)
   const [isNewRowAdded, setIsNewRowAdded] = useState(false);

   const [rowToUpdate, setRowToUpdate] = useState<number | null>(null);
   const [requestError, setRequestError] = useState<any>(null)

   const [serviceExploitants, setServiceExploitants] = useState<ServiceExploitantDataProps[] | null>([])
   const [magasins, setMagasins] = useState<MagasinDataProps[] | null>([])
   const [data, setData] = useState<EmplacementDataProps[] | null>([]);


   useEffect(() => {
      getAllServiceExploitant({ page, size })
         .then((response) => {
            setServiceExploitants(response.serviceExploitants)
         })
         .catch((error) => {
            toast.error('Erreur lors de la récupération des données ', error);
         })

      getAllMagasins({ page, size })
         .then((response) => {
            setMagasins(response.magasins)
         })
         .catch((error) => {
            toast.error('Erreur lors de la récupération des données ', error);
         })

   }, []);


   useEffect(() => {
      if (rowToUpdate) {
         const row = data!.find((row: EmplacementDataProps) => row.emplId === rowToUpdate)
         if (row) {
            setLabel(row.emplLi)
            setServiceId(row.serviceId)
            setMagId(row.magId)
         }
      }
   }, [rowToUpdate])


   useEffect(() => {
      getAllEmplacements({ page, size })
         .then((response) => {
            setData(response.emplacements)
         })
         .catch((error) => {
            toast.error('Erreur lors de la récupération des données ', error);
         })

   }, [isNewRowAdded, page, size]);






   const columns = [
      {
         key: 'emplId',
         label: 'Emplacement Id',
         type: 'integer'
      },
      {
         key: 'emplLi',
         label: 'Libellé',
         type: 'string'
      },
      {
         key: 'magLi',
         label: 'Magasin'
      },
      {
         key: 'serviceLi',
         label: 'Service'
      },
      {
         key: 'emplDtCr',
         label: 'Date de création',
      }

   ]


   const createNewEmplacement = () => {
      createEmplacement(label, magId!, serviceId!)
         .then((response) => {
            toast.success('Emplacement ajouté avec succès', response)
            setIsNewRowAdded(!isNewRowAdded)
         })
         .catch((error) => {
            if (error.response) {
               if (error.response.status === 400) {
                  setRequestError(error.response.data)
               }
            }
         })
   };

   const onRowDelete = (emplId: number) => {
      deleteEmplacement(emplId)
         .then((response) => {
            toast.success('Emplacement supprimé avec succès', response)
            setIsNewRowAdded(!isNewRowAdded)
         }).catch((error) => {
            toast.error('Erreur lors de la suppression de l\'emplacement', error)
         })
   }

   const onRowUpdate = () => {
      updateEmplacement(rowToUpdate!, label, magId!, serviceId!)
         .then((response) => {
            toast.success('Emplacement modifié avec succès', response)
            setIsNewRowAdded(!isNewRowAdded)
            setRowToUpdate(null)
         }).catch((error) => {
            if (error.response) {
               if (error.response.status === 400) {
                  setRequestError(error.response.data)
               }
            }
         })
   }

   return (
      <CrudComponent
         pageTitle="Emplacement"
         columns={columns}
         rowsData={data as Record<string, any>[]}
         onAdd={createNewEmplacement}
         onSearch={() => { }}
         pageIcon={<FontAwesomeIcon icon={faMapLocationDot} />}
         dataAbbreviation="empl"
         onRowDelete={onRowDelete}
         onRowUpdate={onRowUpdate}
         setRowToUpdate={setRowToUpdate}
         resetInput={() => {
            setLabel('')
            setRowToUpdate(null)
            setRequestError(null)
         }}
         isUpdateAuthorized



         addModalContent={
            <div className="w-full flex flex-col gap-4 pb-5">
               <Select
                  variant="bordered"

                  label="Services"
                  onChange={(e) => {
                     setServiceId(parseInt(e.target.value))
                  }}

                  selectedKeys={serviceId ? [serviceId.toString()] : []}

                  isInvalid={requestError?.serviceIdError !== null && requestError?.serviceIdError !== undefined}
                  errorMessage={requestError?.serviceIdError}
               >
                  {serviceExploitants!.map((service) => (
                     <SelectItem key={service.serviceId} value={service.serviceId}>
                        {service.serviceLi}
                     </SelectItem>
                  ))}
               </Select>

               <Select
                  variant="bordered"

                  label="Magasins"
                  onChange={(e) => {
                     setMagId(parseInt(e.target.value))

                  }}

                  selectedKeys={magId ? [magId.toString()] : []}
                  isInvalid={requestError?.magIdError !== null && requestError?.magIdError !== undefined}
                  errorMessage={requestError?.magIdError}
               >
                  {magasins!.map((mag) => (
                     <SelectItem key={mag.magId} value={mag.magId}>
                        {mag.magLi}
                     </SelectItem>
                  ))}
               </Select>
               <Input value={label} type="text" label="Libellé" validationBehavior="aria" radius="sm" size="md"
                  onChange={(e) => setLabel(e.target.value)}
                  isInvalid={requestError?.emplLiError !== null && requestError?.emplLiError !== undefined}
                  errorMessage={requestError?.emplLiError}
               />
            </div>
         }
      />
   )
}
