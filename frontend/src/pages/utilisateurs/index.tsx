import { SearchIcon } from "@/components/icons";
import { title } from "@/components/primitives";
import { getAllUtilisateurs } from "@/services/api/admin.service";
import { UserInfoProps } from "@/types/types";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function UtilisateurPage() {
   const navigate = useNavigate();
   const [data, setData] = useState([])
   
   const [totalUsers, setTotalUsers] = useState(0)
   const [searchTerm, setSearchTerm] = useState("");

   useEffect(() => {
      getAllUtilisateurs().then((response) => {
         setData(response.users)
      })
   }, [])

   const columns = [
      {
         key: 'usrId',
         label: 'ID'
      },
      {
         key: 'usrNom',
         label: 'Nom'
      },
      {
         key: 'usrPrenom',
         label: 'Prénom'
      },
      {
         key: 'usrLogin',
         label: 'Nom d\'utilisateur'
      },
      {
         key: 'roleLi',
         label: 'Rôle'
      }
   ]




   const filteredRows = data!.filter((row) => {
      return Object.values(row).some((value) =>
         String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
   });
   return (

      <div className="flex flex-col gap-6">
         <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="inline-block max-w-lg text-center justify-center">
               <h1 className={title()} style={{
                  textTransform: 'capitalize'
               }}></h1>
            </div>
         </section>

         <Table
            aria-label="Tableau"
            className="w-full"


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

                     />
                     <div className="flex gap-3">



                        <Button
                           className="bg-foreground text-background px-4 py-2"
                           size="lg"
                           variant="flat"
                           color="default"
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
            <TableHeader columns={columns}>
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
                  <TableRow key={item[columns[0].key] } >
                     {(columnKey) => (
                        <TableCell className="text-lg " style={{
                           cursor: 'pointer'
                        }}
                           onClick={() => {
                              const id = getKeyValue(item, columns[0].key)
                              navigate(`/utilisateurs/${id}`,{state:item})
                           }}
                        >{getKeyValue(item, columnKey)}</TableCell>
                     )}
                  </TableRow>
               )}
            </TableBody>
         </Table>

      </div>
   )
}
