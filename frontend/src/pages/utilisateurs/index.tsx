import { SearchIcon } from "@/components/ui/icons";
import { title } from "@/components/primitives";
import { getAllRoles, getAllUtilisateurs } from "@/services/api/admin.service";
import { registerUser } from "@/services/api/auth.service";
import { getAllMagasins } from "@/services/api/batiment.service";
import { getAllServiceExploitant } from "@/services/api/serviceExploitant.service";
import { MagasinDataProps, RegistrationPayload, RoleDataProps, ServiceExploitantDataProps } from "@/types/types";
import { faEye, faEyeSlash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { DatePicker, Divider, Select, SelectItem, Selection } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function UtilisateurPage() {
   const navigate = useNavigate();

   const { isOpen, onOpen, onOpenChange } = useDisclosure();
   const modalRef = useRef(null)

   const [data, setData] = useState([])
   const [roles, setRoles] = useState<RoleDataProps[] | null>([])
   const [searchTerm, setSearchTerm] = useState("");
   const [services, setServices] = useState<ServiceExploitantDataProps[] | null>([])
   const [magasins, setMagasins] = useState<MagasinDataProps[] | null>(null)
   const [usrNom, setUsrNom] = useState<string>('')
   const [usrPrenom, setUsrPrenom] = useState<string>('')
   const [usrLogin, setUsrLogin] = useState<string>('')
   const [usrPassword, setUsrPassword] = useState<string>('')
   const [role, setRole] = useState<number>()
   const [pageNeedReload, setPageNeedReload] = useState(false)

   const { page, size } = { page: 1, size: 5 }
   //TODO

   useEffect(() => {
      getAllUtilisateurs().then((response) => {
         setData(response.users)
      })

      getAllRoles().then((response) => {
         setRoles(response.roles)
      })

      getAllServiceExploitant({ page, size }).then((response) => {

         setServices(response.serviceExploitants)
      }
      ).catch((error) => {
         console.error('Erreur lors de la récupération des données ', error);
      })

      getAllMagasins({ page, size }).then((response) => {
         setMagasins(response.magasins);
      }
      ).catch((error) => {
         console.error('Erreur lors de la récupération des données ', error);
      })
   }, [pageNeedReload])

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

   const toggleVisibility = () => setIsVisible(!isVisible);
   const [isVisible, setIsVisible] = useState(false);

   const [selectedMagasins, setSelectedMagasins] = useState<Selection>(new Set([]))
   const [selectedServices, setSelectedServices] = useState<Selection>(new Set([]))

   const [requestError, setRequestError] = useState<any>(null)



   const filteredRows = data!.filter((row) => {
      return Object.values(row).some((value) =>
         String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
   });


   const handleUserRegistration = () => {
      const userRegsitrationPayload: RegistrationPayload = {
         username: usrLogin,
         password: usrPassword,
         nom: usrNom,
         prenom: usrPrenom,
         roleId: role!
      }
      registerUser(userRegsitrationPayload)
         .then(() => {
            setPageNeedReload(!pageNeedReload)
            toast.success('Nouveau utilisateur enregistré')

         }).catch((error) => {
            console.log(error)
            if (error.response) {
               setRequestError(error.response.data)
            }
         })
   }
   return (
      <>
         <Modal ref={modalRef} isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} size="3xl">
            <ModalContent>
               {(onClose) => (
                  <>
                     <ModalHeader className="flex flex-col gap-1">Ajouter un nouveau utilisateurs</ModalHeader>
                     <ModalBody>
                        <h1 className="text-small text-default-400 ml-1">Nom et prénoms</h1>
                        <div className="flex gap-4">
                           <Input value={usrNom} type="text" label="Nom" isRequired validationBehavior="aria" radius="sm" size="lg" variant="bordered" onChange={(e) => {
                              setUsrNom(e.target.value)
                           }}
                              isInvalid={requestError?.nomError !== null && requestError?.nomError !== undefined}
                              errorMessage={requestError?.nomError}
                           />
                           <Input value={usrPrenom} type="text" label="Prénom" isRequired validationBehavior="aria" radius="sm" size="lg" variant="bordered"
                              onChange={(e) => {
                                 setUsrPrenom(e.target.value)
                              }}
                              errorMessage={requestError?.prenomError}
                              isInvalid={requestError?.prenomError !== null && requestError?.prenomError !== undefined}
                           />
                        </div>


                        <Divider className="my-4" />
                        <h1 className="text-small text-default-400 ml-1">Role et informations de connections</h1>
                        <div className="flex  gap-4">
                           <Input value={usrLogin} type="text" label="Nom d'utilisateur" isClearable validationBehavior="aria" radius="sm" size="lg" variant="bordered"
                              onChange={(e) => {
                                 setUsrLogin(e.target.value)
                              }}

                              errorMessage={requestError?.usernameError}
                              isInvalid={requestError?.usernameError !== null && requestError?.usernameError !== undefined}
                           />
                           <Input value={usrPassword} type={isVisible ? "text" : "password"} label="Mot de passe" isRequired isClearable
                              validationBehavior="aria" radius="sm" size="lg" variant="bordered"
                              onChange={(e) => {
                                 setUsrPassword(e.target.value)
                              }}

                              errorMessage={requestError?.passwordError}
                              isInvalid={requestError?.passwordError !== null && requestError?.passwordError !== undefined}
                              endContent={
                                 <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                    {isVisible ? (
                                       <FontAwesomeIcon icon={faEye} />
                                    ) : (
                                       <FontAwesomeIcon icon={faEyeSlash} />
                                    )}
                                 </button>
                              }
                           />
                        </div>
                        <div className="flex w-3/6  gap-4">

                           <Select
                              variant="bordered"
                              label="Role de l'utilisateur"
                              size="lg"
                              onChange={(e) => {
                                 setRole(parseInt(e.target.value))
                              }}
                              isRequired
                              errorMessage={requestError?.roleIdError}
                              isInvalid={requestError?.roleIdError !== null && requestError?.roleIdError !== undefined}

                           >
                              {roles!.map((role) => (
                                 <SelectItem key={role.roleId} value={role.roleId}>
                                    {role.roleLi}
                                 </SelectItem>
                              ))}
                           </Select>
                        </div>
                        <Divider className="my-4" />
                        <h1 className="text-small text-default-400 ml-1">Accès magasins</h1>
                        <Select
                           variant="bordered"
                           label="Magasins"
                           size="lg"
                           onSelectionChange={setSelectedMagasins}
                           selectedKeys={selectedMagasins}
                           selectionMode="multiple"
                        >
                           {magasins!.map((mag) => (
                              <SelectItem key={mag.magId} value={mag.magId}>
                                 {mag.magLi}
                              </SelectItem>
                           ))}
                        </Select>
                        <div className="flex gap-4">
                           <DatePicker label="Du" isRequired validationBehavior="aria" radius="sm" size="lg" variant="bordered" onChange={(e) => {

                           }} />
                           <DatePicker label="À" validationBehavior="aria" radius="sm" size="lg" variant="bordered" onChange={(e) => {

                           }} />
                        </div>
                        <Divider className="my-4" />

                        <Select
                           variant="bordered"
                           label="Services"
                           size="lg"
                           selectionMode="multiple"
                           selectedKeys={selectedServices}
                           onSelectionChange={setSelectedServices}
                        >
                           {services!.map((service) => (
                              <SelectItem key={service.serviceId} value={service.serviceId}>
                                 {service.serviceLi}
                              </SelectItem>
                           ))}
                        </Select>

                     </ModalBody>
                     <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                           Annulez
                        </Button>
                        <Button color="primary" onPress={handleUserRegistration}>
                           Enregistrez
                        </Button>
                     </ModalFooter>
                  </>
               )}
            </ModalContent>
         </Modal>
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
                              onPress={onOpen}
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
                     <TableRow key={item[columns[0].key]} >
                        {(columnKey) => (
                           <TableCell className="text-lg " style={{
                              cursor: 'pointer'
                           }}
                              onClick={() => {
                                 const id = getKeyValue(item, columns[0].key)
                                 navigate(`/utilisateurs/${id}`, { state: item })
                              }}
                           >{getKeyValue(item, columnKey)}</TableCell>
                        )}
                     </TableRow>
                  )}
               </TableBody>
            </Table>

         </div>
      </>
   )
}
