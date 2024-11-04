import { DefaultTable } from "@/components/ui/table/default";
import { Autocomplete, Button, DatePicker, Divider } from "@nextui-org/react";
export function UserAccessPage() {
   //static data
   const chipClassName = [
      {
         key: 'active',
         class: 'bg-green-100 text-green-600'
      },
      {
         key: 'inactive',
         class: 'bg-red-100 text-red-600'
      },
      {
         key: 'pending',
         class: 'bg-yellow-100 text-yellow-600'
      }
   ]
   const magasinColumns = [
      {
         key: 'mag_id',
         label: 'Identifiant Magasin'
      },
      {
         key: 'label',
         label: 'Libellé'
      },
      {
         key: 'affectation',
         label: 'Date Affectation'
      },
      {
         key: 'debut',
         label: 'Date Début'
      },
      {
         key: 'fin',
         label: 'Date fin'
      },
      {
         key: 'status',
         label: 'Status',
         isChip: true
      },
      {
         key: 'duree',
         label: 'Durée (en jours)'
      }
   ]
   const staticData = [
      {
         mag_id: 8312,
         label: "MAG_AMBOKATRA",
         affectation: "04 Novembre 2024",
         debut: "10 Novembre 2024",
         fin: "À Déterminer",
         status: "Active",
         duree: '0 jours',
      },
      {
         mag_id: 8313,
         label: "MAG_ANTANANARIVO",
         affectation: "05 Novembre 2024",
         debut: "11 Novembre 2024",
         fin: "À Déterminer",
         status: "Inactive",
         duree: '3 jours',
      },
      {
         mag_id: 8314,
         label: "MAG_TOAMASINA",
         affectation: "06 Novembre 2024",
         debut: "12 Novembre 2024",
         fin: "À Déterminer",
         status: "Pending",
         duree: '1 jours',
      },
      {
         mag_id: 8315,
         label: "MAG_FIANARANTSOA",
         affectation: "07 Novembre 2024",
         debut: "13 Novembre 2024",
         fin: "À Déterminer",
         status: "Active",
         duree: '2 jours',
      },
      {
         mag_id: 8316,
         label: "MAG_MAJUNGA",
         affectation: "08 Novembre 2024",
         debut: "14 Novembre 2024",
         fin: "À Déterminer",
         status: "Inactive",
         duree: '5 jours',
      },
   ];



   return <div className="mt-5 w-full p-5 h-[500px] ">
      <h1 className="text-3xl mb-3">Modification accès magasins</h1>
      <div className="w-3/6 mb-5 flex flex-col gap-3 border-solid border-1 p-5 rounded-md shadow-md">
         <div>
            <h1 className="text-small text-default-400 ml-1 mb-2">Magasins</h1>
            <Autocomplete variant="bordered" radius="sm" >
               {[]}
            </Autocomplete>
         </div>
         <div className="flex gap-4 ">
            <div className="w-3/6">
               <h1 className="text-small text-default-400 ml-1 mb-2">Début</h1>
               <DatePicker variant="bordered" radius="sm" isRequired />
            </div>
            <div className="w-3/6">
               <h1 className="text-small text-default-400 ml-1 mb-2">Fin</h1>
               <DatePicker variant="bordered" radius="sm" />
            </div>
         </div>
         <div className="w-3/6 ">
            <Button size="sm" className="p-3 w-[150px]" color="primary">
               Validez
            </Button>
         </div>
      </div>
      <DefaultTable headers={magasinColumns} data={staticData!} chipClassName={chipClassName} />
      <Divider className="my-2 mt-10" />
      <h1 className="text-3xl mb-3">Modification accès magasins</h1>
   </div >
}