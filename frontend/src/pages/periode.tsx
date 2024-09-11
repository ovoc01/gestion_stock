

import {Input} from "@nextui-org/react";
import { useState } from "react";

import {
   Autocomplete,
   AutocompleteItem
} from "@nextui-org/react";
import CrudComponent from "@/components/crudComponents";

export default function Periode() {
   const columns = [
      {
         key: "art_id",
         label: "Article ID",
         type: "integer",
         "primary_key": true,
         "increment": true
      },
      {
         key: "art_sous_famille_id",
         label: "Sous Famille ID",
         type: "integer",
         "not_null": true,
         "foreign_key": "sous_famille.sous_famille_id"
      },
      {
         key: "art_unite_id",
         label: "Unité ID",
         type: "integer",
         "not_null": true,
         "foreign_key": "unite.unite_id"
      },
      {
         key: "art_li",
         label: "Libellé",
         type: "varchar"
      },
      {
         key: "art_pu",
         label: "Prix Unitaire",
         type: "decimal"
      },
      {
         key: "art_qte",
         label: "Quantité",
         type: "decimal"
      },
      {
         key: "art_cd",
         label: "Code Article",
         type: "varchar",
         "unique": true,
         "not_null": true
      },
      {
         key: "art_ref",
         label: "Référence Article",
         type: "varchar",
         "unique": true,
         "note": "Numéro de série"
      },
      {
         key: "art_dt_modif",
         label: "Date de Modification",
         type: "timestamp"
      },
      {
         key: "art_cump",
         label: "Coût Unitaire Moyen Pondéré",
         type: "decimal"
      },
      {
         key: "art_u",
         label: "Unite",
         type: "text"
      },
      {
         key: "art_qte_securite",
         label: "Quantité de Sécurité",
         type: "decimal"
      },
      {
         key: "art_duree_vie",
         label: "Durée de Vie",
         type: "decimal",
         "note": "En jours"
      }
   ]

   const rows = [
      {
         art_id: 1,
         art_sous_famille_id: 101,
         art_unite_id: 5,
         art_li: "Article A",
         art_pu: 15.5,
         art_qte: 100,
         art_cd: "ART-A01",
         art_ref: "SN001",
         art_dt_modif: "2024-01-30T12:30:00",
         art_cump: 14.75,
         art_u: 'Kg',
         art_qte_securite: 10,
         art_duree_vie: '365 jours',
      },
      {
         art_id: 2,
         art_sous_famille_id: 102,
         art_unite_id: 5,
         art_li: "Article B",
         art_pu: 20.0,
         art_qte: 50,
         art_cd: "ART-B01",
         art_ref: "SN002",
         art_dt_modif: "2024-01-29T10:15:00",
         art_cump: 19.5,
         art_u: 'Piece',
         art_qte_securite: 5,
         art_duree_vie: '180 jours',
      },
   ];


   return (
      <>
         <CrudComponent
            columns={columns}
            rowsData={rows}
            onAdd={() => { }}
            onSearch={() => { }}
            addModalContent={

               <div className="w-full flex flex-col gap-4 pb-5">
                  <Input type="text" label="Libellé" isRequired />
                  <Autocomplete
                     label="Sous famille"
                     className="w-full"
                  >
                     {rows.map((animal) => (
                        <AutocompleteItem key={animal.art_id} value={animal.art_id}>
                           {animal.art_li}
                        </AutocompleteItem>
                     ))}
                  </Autocomplete>

                  <Input type="number" label="Prix unitaire" isRequired />
                  <Input type="number" label="Durée de vie estimative en jours" />
               </div>

            }
         />
      </>

   );
}


