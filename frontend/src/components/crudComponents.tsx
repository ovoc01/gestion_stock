import {
   Table,
   TableHeader,
   TableColumn,
   TableBody,
   TableRow,
   TableCell,
   getKeyValue,
   Pagination,
   Button,
   Input,
   useDisclosure,
   Modal,
   ModalContent,
   ModalHeader,
   ModalBody,
   ModalFooter,
   Dropdown,
   DropdownItem,
   DropdownMenu,
   DropdownTrigger,
} from "@nextui-org/react";
import { useCallback, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { title } from "./primitives";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

interface Column {
   key: string;
   label: string;
   type?: string; // Vous pouvez ajouter d'autres propriétés de colonne si nécessaire
}

interface RowData {
   [key: string]: any; // Les données de ligne peuvent avoir n'importe quelle structure
}

interface CrudComponentProps {
   pageIcon?: React.ReactNode;
   pageTitle?: string;
   columns: Column[];
   rowsData: RowData[];
   pages?: number;
   initialPage?: number;
   addModalContent?: React.ReactNode;
   errorMessage?: string;
   modalTitle?: string;
   isActionAuthorized?: boolean
   onAdd?: () => void;
   onSearch?: (searchTerm: string) => void;
   onPageChange?: (page: number) => void;
   onRowDelete?:(id:number)=>void
}

const ExportButton = () => {
   return (
      <Dropdown >
         <DropdownTrigger>
            <Button

               size="lg"
               color="success"
               className=" text-background px-4 py-2"
               endContent={
                  <FontAwesomeIcon icon={faShare} />
               }
            >
               Exporter
            </Button>
         </DropdownTrigger>
         <DropdownMenu  >
            <DropdownItem key="new">PDF</DropdownItem>
            <DropdownItem key="copy">Excel</DropdownItem>
            <DropdownItem key="edit">CSV</DropdownItem>

         </DropdownMenu>
      </Dropdown>
   )
}

const DeleteModal = ({ isOpen, onOpenChange ,liValue,idValue,onRowDelete}: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void,liValue:string|null ,idValue:number|null,onRowDelete:(id:number) => void}) => {
   return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
         <ModalContent>
            {(onClose) => (
               <>
                  <ModalHeader>Supprimer</ModalHeader>
                  <ModalBody>
                  <p>Êtes-vous sûr de vouloir supprimer l'élément : <b>{liValue}</b> ?</p>
                  </ModalBody>
                  <ModalFooter>
                     <Button
                        size="lg"
                        color="danger"
                        variant="light"
                        onPress={onClose}
                        radius="sm"
                     >
                        Annuler
                     </Button>
                     <Button
                        size="lg"
                        radius="sm"
                        className="bg-foreground text-background"
                        onPress={() => {
                           // Supprimer l'élément
                           onRowDelete(idValue!)
                        }}
                     >
                        Valider
                     </Button>
                  </ModalFooter>
               </>
            )}
         </ModalContent>
      </Modal>
   );
}



const CrudComponent: React.FC<CrudComponentProps> = ({
   columns,
   rowsData,
   pages = 1,
   initialPage = 1,
   onPageChange,
   onAdd,
   onSearch,
   addModalContent,
   errorMessage,
   pageTitle,
   pageIcon,
   isActionAuthorized,
   onRowDelete
}) => {

   const [searchTerm, setSearchTerm] = useState("");
   const [liValueToDelete, setLiValueToDelete] = useState<string | null>(null); 
   const [idValueDelete, setIdValueToDelete] = useState<number | null>(null); 
   const { isOpen, onOpen, onOpenChange } = useDisclosure();
   const { isOpen: deleteIsOpen, onOpen: deleteOnOpen, onOpenChange: deleteOnOpenChange } = useDisclosure();

   const columnWithAction = columns.concat({
      key: "action",
      label: "Actions",
   });

   type DataType = typeof rowsData[0]

   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      onSearch && onSearch(e.target.value);
   };

   const filteredRows = rowsData.filter((row) => {
      return Object.values(row).some((value) =>
         String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
   });

   const renderCell = useCallback((data: DataType, columnKey: React.Key) => {
      const cellValue = data[columnKey as keyof DataType]
      let liValue = null;
      let idValue = null;
      let foundData = 0

      for (const key in data) {
         if (key.toLowerCase().includes("li") && typeof data[key] === 'string') {
            liValue = data[key];
            foundData++
            if(foundData===2)break; // Assuming you only need one "li" value per row 
         }
         if (key.toLowerCase().includes("id") && typeof data[key] === 'number') {
            idValue = data[key];
            foundData++
            if(foundData===2)break; // Assuming you only need one "li" value per row 
         }
      }
      switch (columnKey) {
         case 'action':
            return (
               <div className="relative flex justify-start items-center ">
                  <Button color="warning" variant="light">
                     <FontAwesomeIcon icon={faPenToSquare} fontSize={16} />
                  </Button>
                  <Button color="danger" variant="light" onPress={()=>{
                     setLiValueToDelete(liValue)
                     setIdValueToDelete(idValue)
                     deleteOnOpen()
                  }}>
                     <FontAwesomeIcon icon={faTrash} fontSize={16} />
                  </Button>
               </div>
            )
         default:
            return cellValue
      }

   }, [])


   return (
      <>
         <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" className="min-h-[300px]">
            <ModalContent>
               {(onClose) => (
                  <>
                     <ModalHeader className="flex flex-col gap-1 text-xl" >
                        Ajouter {pageTitle}

                     </ModalHeader>
                     <ModalBody>{addModalContent}</ModalBody>
                     <h2 className="text-danger flex flex-col gap-1 ml-8" >
                        {errorMessage}
                     </h2>
                     <ModalFooter>
                        <Button size="lg" color="danger" variant="light" onPress={onClose} radius="sm">
                           Annuler
                        </Button>
                        <Button
                           size="lg"
                           radius="sm"
                           className="bg-foreground text-background"
                           onPress={() => {

                              onAdd && onAdd();
                           }}
                        >
                           Valider
                        </Button>
                     </ModalFooter>
                  </>
               )}
            </ModalContent>
         </Modal>
         <DeleteModal isOpen={deleteIsOpen} onOpenChange={deleteOnOpenChange} liValue={liValueToDelete} idValue={idValueDelete} onRowDelete={onRowDelete!}/>

         <div >
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
               <div className="inline-block max-w-lg text-center justify-center">
                  <h1 className={title()} style={{
                     textTransform: 'capitalize'
                  }}>{pageIcon} {pageTitle}</h1>
               </div>
            </section>
            <Table
               aria-label="Tableau"
               className="w-full"
               bottomContent={
                  pages > 0 ? (
                     <div className="flex w-full justify-center">
                        <Pagination
                           isCompact
                           showControls
                           showShadow
                           color="default"
                           page={initialPage}
                           total={pages}
                           onChange={(page) => onPageChange!(page)}
                        />

                     </div>
                  ) : null
               }
               topContent={
                  <div className="flex flex-col gap-4">
                     <div className="flex justify-between gap-3 items-end">
                        <Input
                           isClearable
                           classNames={{
                              base: "w-full sm:max-w-[44%]",
                              inputWrapper: "border-1",
                           }}
                           size="lg"
                           placeholder="Rechercher..."
                           startContent={
                              <SearchIcon className="text-default-300" />
                           }
                           variant="bordered"
                           value={searchTerm}
                           onChange={handleSearch}
                        />
                        <div className="flex gap-3">

                           <ExportButton />

                           <Button
                              className="bg-foreground text-background px-4 py-2"
                              onPress={onOpen}
                              size="lg"
                              variant="flat"
                              endContent={
                                 <FontAwesomeIcon icon={faPlus} />
                              }
                           >
                              Ajouter
                           </Button>
                        </div>
                     </div>
                  </div>
               }
               topContentPlacement="outside"
            >
               <TableHeader columns={isActionAuthorized ? columnWithAction : columns}>
                  {(column) => (
                     <TableColumn key={column.key}>
                        <h1 className="text-lg">
                           {column.label}
                        </h1>
                     </TableColumn>
                  )}

               </TableHeader>
               <TableBody items={filteredRows} emptyContent={"Pas d'élément à afficher"}>
                  {(item) => (
                     <TableRow key={item[columns[0].key]} >
                        {(columnKey) => (
                           <TableCell className="text-lg">{renderCell(item, columnKey)}</TableCell>
                        )}
                     </TableRow>
                  )}
               </TableBody>
            </Table>

         </div>
      </>
   );
};

export default CrudComponent;

