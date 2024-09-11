import CrudComponent from "@/components/crudComponents"


export default function ChantierPage() {
   const columns = [
      {
         key: 'chantier_id',
         label: 'Chantier ID',
         type: 'integer'
      },
      {
         key: 'chantier_num_bu',
         label: 'Numéro Affaire',
         type: 'integer'
      },
      {
         key: 'chantier_li',
         label: 'Libéllé',
         type: 'string'
      },
      {
         key: 'chantier_resp',
         label: 'Responsable',
         type: 'string'
      }
   ]

   const rows = [
      {
         chantier_id: 12345,
         chantier_num_bu: 2204589,
         chantier_li: 'Chantier QQ PK 13',
         chantier_resp: 'Tendry Rakotoarivelo'
      }
   ]


   return (
      <CrudComponent
         columns={columns}
         rowsData={rows}
         onAdd={() => { }}
         onSearch={() => { }}
         addModalContent = {
            <div className="w-full flex flex-col gap-4 pb-5">
                  
               </div>
         }
      />
   )
}