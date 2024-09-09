

import { SearchIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";

import {
   Table, TableHeader, TableColumn, TableBody,
   TableRow, TableCell, getKeyValue, Pagination, Button, Dropdown,
   DropdownItem, DropdownMenu, DropdownTrigger, Input,
   useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
} from "@nextui-org/react";
import { useState } from "react";

import {
   Autocomplete,
   AutocompleteItem
} from "@nextui-org/react";

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

   const pages = 50
   const [page, setPage] = useState(10)

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

   const { isOpen, onOpen, onOpenChange } = useDisclosure();

   return (
      <>
         <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
               {(onClose) => (
                  <>
                     <ModalHeader className="flex flex-col gap-1">Ajouter une nouvelle article</ModalHeader>
                     <ModalBody>
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
                           <Input type="number" label="Durée de vie estimative en jours"/>
                        </div>
                     </ModalBody>
                     <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                           Annuler
                        </Button>
                        <Button className="bg-foreground text-background" onPress={onClose}>
                           Valider
                        </Button>
                     </ModalFooter>
                  </>
               )}
            </ModalContent>
         </Modal>

         <DefaultLayout>

            <Table aria-label="Example table with dynamic content" className="w-full"
               bottomContent={
                  pages > 0 ? (
                     <div className="flex w-full justify-center">
                        <Pagination
                           isCompact
                           showControls
                           showShadow
                           color="default"
                           page={page}
                           total={pages}
                           onChange={(page) => setPage(page)}

                        />
                     </div>
                  ) : null
               }

               topContent={<div className="flex flex-col gap-4">
                  <div className="flex justify-between gap-3 items-end">
                     <Input
                        isClearable
                        classNames={{
                           base: "w-full sm:max-w-[44%] ",
                           inputWrapper: "border-1",
                        }}

                        size="lg"
                        startContent={<SearchIcon className="text-default-300" />}

                        variant="bordered"

                     />
                     <div className="flex gap-3">
                        <Dropdown>
                           <DropdownTrigger className="hidden md:flex">
                              <Button

                                 size="lg"
                                 variant="flat"
                              >
                                 Status
                              </Button>
                           </DropdownTrigger>
                           <DropdownMenu
                              disallowEmptySelection
                              aria-label="Table Columns"
                              closeOnSelect={false} >
                              <DropdownItem key={"yes"} className="capitalize">
                                 Test
                              </DropdownItem>
                           </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                           <DropdownTrigger className="hidden md:flex">
                              <Button
                                 size="lg"
                                 variant="flat"
                              >
                                 Columns
                              </Button>
                           </DropdownTrigger>
                           <DropdownMenu
                              disallowEmptySelection
                              aria-label="Table Columns"
                              closeOnSelect={false}

                              selectionMode="multiple"

                           >
                              <DropdownItem key={"yes"} className="capitalize">
                                 Test
                              </DropdownItem>

                           </DropdownMenu>
                        </Dropdown>
                        <Button
                           className="bg-foreground text-background"
                           onPress={onOpen}
                           size="lg"
                        >
                           Ajouter Article
                        </Button>
                     </div>
                  </div>

               </div>}
               topContentPlacement="outside"
            >
               <TableHeader columns={columns}>
                  {(column) => <TableColumn className="text-sm" key={column.key}>{column.label}</TableColumn>}
               </TableHeader>
               <TableBody items={rows}>
                  {(item) => (
                     <TableRow key={item.art_id}>
                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </DefaultLayout>
      </>

   );
}


