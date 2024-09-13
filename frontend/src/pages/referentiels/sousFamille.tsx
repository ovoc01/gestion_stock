import CrudComponent from "@/components/crudComponents"
import { faCube, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import { useEffect, useState } from "react";
export default function SousFamillePage() {



   const [data, setData] = useState([]);

   useEffect(() => {


   }, []);


   const columns = [
      {
         key: 'sousFamId',
         label: 'Sous Famille Id',
         type: 'integer'
      },
      {
         key: 'famId',
         label: 'Famille',
         type: 'string'
      },
      {
         key: 'sousFamLi',
         label: 'Libellé',
         type: 'string'
      },
      {
         key: 'sousFamDtCr',
         label: 'Date de création',
         type: 'string'
      }

   ]





   const createNewFamille = () => {

   };

   return (
      <CrudComponent
         pageTitle="Sous Famille"
         columns={columns}
         rowsData={data}
         onAdd={createNewFamille}
         onSearch={() => { }}
         pageIcon={<FontAwesomeIcon icon={faCube} />}

         addModalContent={
            <div className="w-full flex flex-col gap-4 pb-5">

            </div>
         }
      />
   )
}
