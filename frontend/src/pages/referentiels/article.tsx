import CrudComponent from "@/components/crudComponents"
import {  faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import { useEffect, useState } from "react";
export default function ArticlePage() {



   const [data, setData] = useState([]);

   useEffect(() => {


   }, []);


   const columns = [
      {
         key: 'artId',
         label: 'Article Id',
         type: 'integer'
      },
      {
         key: 'artRef',
         label: 'Reference',
         type: 'string'
      },
      {
         key:'artCd',
         label:'Code'
      },
      {
         key: 'artLi',
         label: 'Libellé',
         type: 'string'
      },
      {
         key:'artPu',
         label:'Prix unitaire'
      },
      {
         key:'artQte',
         label:'Quantité en Stock'
      },
      {
         key:'artCmup',
         label:'CMUP'
      },
      {
         key:'artUsr',
         label:'Utilisateur'
      },
      {
         key:'artDtCr',
         label:'Date de création',
      }

   ]





   const createNewFamille = () => {

   };

   return (
      <CrudComponent
         pageTitle="Article"
         columns={columns}
         rowsData={data}
         onAdd={createNewFamille}
         onSearch={() => { }}
         pageIcon={<FontAwesomeIcon icon={faNewspaper} />}

         addModalContent={
            <div className="w-full flex flex-col gap-4 pb-5">

            </div>
         }
      />
   )
}
