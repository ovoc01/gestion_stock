import CrudComponent from "@/components/crudComponents"
import {  faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import { useEffect, useState } from "react";
export default function MagasinPage() {



   const [data, setData] = useState([]);

   useEffect(() => {


   }, []);


   const columns = [
      {
         key: 'magId',
         label: 'Magasin Id',
         type: 'integer'
      },
      {
         key: 'magLi',
         label: 'Libellé',
         type: 'string'
      },
      {
         key:'magResp',
         label:'Responsable'
      },
      {
         key:'magDtCr',
         label:'Date de création',
      }

   ]





   const createNewFamille = () => {

   };

   return (
      <CrudComponent
         pageTitle="Magasin"
         columns={columns}
         rowsData={data}
         onAdd={createNewFamille}
         onSearch={() => { }}
         pageIcon={<FontAwesomeIcon icon={faWarehouse} />}

         addModalContent={
            <div className="w-full flex flex-col gap-4 pb-5">

            </div>
         }
      />
   )
}
