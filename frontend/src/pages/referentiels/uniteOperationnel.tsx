import CrudComponent from "@/components/crudComponents"
import { faBuilding, faBuildingShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Input } from "@nextui-org/input";

import { useEffect, useState } from "react";
export default function UniteOperationnelPage() {



   const [data, setData] = useState([]);

   useEffect(() => {
      

   }, []);


   const columns = [
      {
         key: 'unopId',
         label: 'Unité operationnel ID',
         type: 'integer'
      },
      {
         key: 'unopRef',
         label: 'Reference',
         type: 'string'
      },
      {
         key: 'unopNumBu',
         label: 'Numéro Bu',
         type: 'integer'
      },
      {
         key: 'unopLi',
         label: 'Libéllé',
         type: 'string'
      },
      {
         key: 'unopNumAff',
         label: 'Numero Affaire',
         type: 'string'
      }
   ]

   

   

   const createNewUnOp = () => {
      
   };

   return (
      <CrudComponent
      pageTitle="Unité operationnel"
         columns={columns}
         rowsData={data}
         onAdd={createNewUnOp}
         onSearch={() => { }}
         pageIcon={<FontAwesomeIcon icon={faBuilding} />}
         
         addModalContent={
            <div className="w-full flex flex-col gap-4 pb-5">
               <Input  type="text" label="Nom unité operationnel" isRequired variant="bordered"/>
               <Input type="number" label="Numero bu" isRequired  variant="bordered"/>
               <Input type="text" label="Libéllé bu" isRequired  variant="bordered" />
               <Input type="number" label="Numero affaire" isRequired  variant="bordered" />
               <Input type="text" label="Mdm id" isRequired  variant="bordered"/>
            </div>
         }
      />
   )
}
