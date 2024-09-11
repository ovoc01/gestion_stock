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
} from "@nextui-org/react";
import { useState } from "react";
import { SearchIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";

interface Column {
   key: string;
   label: string;
   type?: string; // Vous pouvez ajouter d'autres propriétés de colonne si nécessaire
}

interface RowData {
   [key: string]: any; // Les données de ligne peuvent avoir n'importe quelle structure
}

interface CrudComponentProps {
   columns: Column[];
   rowsData: RowData[];
   pages?: number;
   initialPage?: number;
   onAdd?: () => void;
   onSearch?: (searchTerm: string) => void;
   addModalContent?: React.ReactNode;
}

const CrudComponent: React.FC<CrudComponentProps> = ({
   columns,
   rowsData,
   pages = 1,
   initialPage = 1,
   onAdd,
   onSearch,
   addModalContent,
}) => {
   const [page, setPage] = useState(initialPage);
   const [searchTerm, setSearchTerm] = useState("");
   const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
         <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
               {(onClose) => (
                  <>
                     <ModalHeader className="flex flex-col gap-1">
                        Ajouter
                     </ModalHeader>
                     <ModalBody>{addModalContent}</ModalBody>
                     <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                           Annuler
                        </Button>
                        <Button
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

         <DefaultLayout>
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
                           <Button
                              className="bg-foreground text-background"
                              onPress={onOpen}
                              size="lg"
                           >
                              Ajouter
                           </Button>
                        </div>
                     </div>
                  </div>
               }
               topContentPlacement="outside"
            >
               <TableHeader columns={columns}>
                  {(column) => (
                     <TableColumn className="text-sm" key={column.key}>
                        {column.label}
                     </TableColumn>
                  )}
               </TableHeader>
               <TableBody items={filteredRows}>
                  {(item) => (
                     <TableRow key={item[columns[0].key]}>
                        {(columnKey) => (
                           <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                        )}
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </DefaultLayout>
      </>
   );
};

export default CrudComponent;