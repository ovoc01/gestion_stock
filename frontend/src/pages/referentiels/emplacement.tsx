import CrudComponent from "@/components/crudComponents"
import { faMapLocationDot, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import { useEffect, useState } from "react";
export default function EmplacementPage() {



   const [data, setData] = useState([]);

   useEffect(() => {


   }, []);


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
         key: 'emplMag',
         label: 'Magasin'
      },
      {
         key: 'emptCr',
         label: 'Date de création',
      }

   ]



   const createNewFamille = () => {

   };

   return (
      <CrudComponent
         pageTitle="Emplacement"
         columns={columns}
         rowsData={data}
         onAdd={createNewFamille}
         onSearch={() => { }}
         pageIcon={<FontAwesomeIcon icon={faMapLocationDot} />}

         addModalContent={
            <div className="w-full flex flex-col gap-4 pb-5">

            </div>
         }
      />
   )
}
