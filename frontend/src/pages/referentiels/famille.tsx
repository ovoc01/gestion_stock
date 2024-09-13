import CrudComponent from "@/components/crudComponents"
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import { useEffect, useState } from "react";
export default function FamillePage() {



   const [data, setData] = useState([]);

   useEffect(() => {


   }, []);


   const columns = [
      {
         key: 'famId',
         label: 'Famille Id',
         type: 'integer'
      },
      {
         key: 'famRef',
         label: 'Reference',
         type: 'string'
      },
      {
         key: 'famLi',
         label: 'Libellé',
         type: 'string'
      },

   ]





   const createNewFamille = () => {

   };

   return (
      <CrudComponent
         pageTitle="Famille"
         columns={columns}
         rowsData={data}
         onAdd={createNewFamille}
         onSearch={() => { }}
         pageIcon={<FontAwesomeIcon icon={faLayerGroup} />}

         addModalContent={
            <div className="w-full flex flex-col gap-4 pb-5">

            </div>
         }
      />
   )
}
