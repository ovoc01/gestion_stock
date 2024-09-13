import CrudComponent from "@/components/crudComponents"
import { faLayerGroup, faRuler } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import { useEffect, useState } from "react";
export default function UnitePage() {



   const [data, setData] = useState([]);

   useEffect(() => {


   }, []);


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
         key: 'uniteAbr',
         label: 'Abbréviation',
         type: 'string'
      },

   ]





   const createNewFamille = () => {

   };

   return (
      <CrudComponent
         pageTitle="Unité"
         columns={columns}
         rowsData={data}
         onAdd={createNewFamille}
         onSearch={() => { }}
         pageIcon={<FontAwesomeIcon icon={faRuler} />}

         addModalContent={
            <div className="w-full flex flex-col gap-4 pb-5">

            </div>
         }
      />
   )
}
