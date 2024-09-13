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
import { useState } from "react";
import { SearchIcon } from "@/components/icons";
import { title } from "./primitives";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faPlus, faShare } from "@fortawesome/free-solid-svg-icons";

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
   onAdd?: () => void;
   onSearch?: (searchTerm: string) => void;
   addModalContent?: React.ReactNode;
   errorMessage?: string;
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


const CrudComponent: React.FC<CrudComponentProps> = ({
   columns,
   rowsData,
   pages = 1,
   initialPage = 1,
   onAdd,
   onSearch,
   addModalContent,
   errorMessage,
   pageTitle,
   pageIcon
}) => {
   const [page, setPage] = useState(initialPage);
   const [searchTerm, setSearchTerm] = useState("");
   const { isOpen, onOpen, onOpenChange } = useDisclosure();
   const columnWithAction = columns.concat({
      key: "action",
      label: "Actions",
   });

   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      onSearch && onSearch(e.target.value);
   };

   const filteredRows = rowsData.filter((row) => {
      return Object.values(row).some((value) =>
         String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
   });


   return (
      <>
         <Modal isOpen={isOpen} onOpenChange={onOpenChange} >
            <ModalContent>
               {(onClose) => (
                  <>
                     <ModalHeader className="flex flex-col gap-1">
                        Ajouter
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
                              onClose();
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

         <div>
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
                           page={page}
                           total={pages}
                           onChange={(page) => setPage(page)}
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
                              className="bg-foreground text-background px-4 py-2 "
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
               <TableHeader columns={columnWithAction}>
                  {(column) => (
                     <TableColumn className="text-sm" key={column.key}>
                        {column.label}
                     </TableColumn>
                  )}

               </TableHeader>
               <TableBody items={filteredRows} emptyContent={"Pas d'élément à afficher"}>
                  {(item) => (
                     <TableRow key={item[columns[0].key]} >
                        {(columnKey) => (
                           <TableCell>{getKeyValue(item, columnKey)}</TableCell>
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

