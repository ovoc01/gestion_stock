import { getAllRoles } from "@/services/api/admin.service";
import { MagasinDataProps, RoleDataProps, RowData, ServiceExploitantDataProps, UserInfoProps } from "@/types/types";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "@nextui-org/input";
import { Button, DatePicker, Divider, getKeyValue, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getLocalTimeZone, fromDate, DateValue } from "@internationalized/date";
import { addUserToService, getAllServiceExploitant, getAllUsrServiceExploitant } from "@/services/api/service-exploitant.service";
import { addUtilisateurToMagasin, getAllMagasins, getAllUtilisateurMagasins } from "@/services/api/batiment.service";



export default function UserDetails() {
   const location = useLocation();
   const user = location.state as UserInfoProps;
   const { usrNom, usrPrenom, usrLogin, roleId } = user;

   const [usrNomSate, setUsrNom] = useState(usrNom)
   const [usrPrenomState, setUsrPrenom] = useState(usrPrenom)
   const [usrLoginState, setUsrLogin] = useState(usrLogin)
   const [roleIdState, setRoleId] = useState(roleId)

   const [isUserDataChanged, setIsUserDataChanged] = useState(false)

   const { isOpen, onOpen, onOpenChange } = useDisclosure();


   const [isVisible, setIsVisible] = useState(false);

   const [userDetails, setUserDetsails] = useState<UserInfoProps>(user)

   const [dateCreation, setDateCreation] = useState<DateValue>(fromDate(new Date(user.usrDtCr), getLocalTimeZone()))
   const [roles, setRoles] = useState<RoleDataProps[] | null>([])

   const [acitiveModalContent, setActiveModalContent] = useState<string | null>(null)

   const [serviceId, setServiceId] = useState<number | null>(null)
   const [magasinId, setMagasinId] = useState<number | null>(null)

   const [services, setServices] = useState<ServiceExploitantDataProps[] | null>([])
   const [magasins, setMagasins] = useState<MagasinDataProps[] | null>(null)

   const [usrServiceExploitant, setUsrServiceExploitant] = useState<RowData[] | null>([])
   const [usrMagasins, setUsrMagasins] = useState<RowData[] | null>([])

   useEffect(() => {
      getAllRoles().then((response) => {
         setRoles(response.roles)
      })

      getAllUsrServiceExploitant(userDetails.usrId).then((response) => {
         const d = response.services as Record<string, any>[]
         setUsrServiceExploitant(d)
      }).catch((error) => {
         console.error('Erreur lors de la récupération des données ', error);
      })

      getAllUtilisateurMagasins(userDetails.usrId).then((response) => {
         const d = response.magasins as Record<string, any>[]
         setUsrMagasins(d)
      })
   }, [isUserDataChanged])


   const { page, size } = { page: 1, size: 5 }

   useEffect(() => {

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

   }, [acitiveModalContent])


   const toggleVisibility = () => setIsVisible(!isVisible);

   const ServiceModalContent = () => {
      return <>
         <Select

            label="Services"
            onChange={(e) => {
               setServiceId(parseInt(e.target.value))
            }}

            selectedKeys={serviceId ? [serviceId.toString()] : []}

         >
            {services!.map((service) => (
               <SelectItem key={service.serviceId} value={service.serviceId}>
                  {service.serviceLi}
               </SelectItem>
            ))}
         </Select>
      </>
   }

   const MagasinModalContent = () => {
      return <>
         <Select

            label="Magasins"
            onChange={(e) => {
               setMagasinId(parseInt(e.target.value))
            }}
            selectedKeys={magasinId ? [magasinId.toString()] : []}

         >
            {magasins!.map((magasin) => (
               <SelectItem key={magasin.magId} value={magasin.magId}>
                  {magasin.magLi}
               </SelectItem>
            ))}
         </Select>
      </>
   }

   const handleModalOpen = (activeModalContent: string) => {
      setActiveModalContent(activeModalContent)
      onOpen()
   }

   const handleModalValidation = () => {
      if (acitiveModalContent === 'service') {
         addUserToService(userDetails.usrId, serviceId!)
            .catch((error) => {
               console.log('error', error)
            })
      } else {
         addUtilisateurToMagasin(userDetails.usrId, magasinId!)
            .catch((error) => {
               console.log('error', error)
            })
      }
      setIsUserDataChanged(!isUserDataChanged)

   }

   const serviceColumns = [

      {
         key: 'serviceLi',
         label: 'SERVICE',
         type: 'string'
      },

      {
         key: 'depuisr',
         label: 'Depuis quand',
         type: 'string'
      },
   ]

   const magasinColumns = [
      {
         key: 'magLi',
         label: 'MAGASIN',
         type: 'string'
      },
      {
         key: 'depuis',
         label: 'DEPUIS',
         type: 'string'
      }
   ]


   return <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl" >
         <ModalContent>
            {(onClose) => (
               <>
                  <ModalHeader className="flex flex-col gap-1">Listes des services</ModalHeader>
                  <ModalBody>
                     {
                        acitiveModalContent === 'service' ? <ServiceModalContent /> : <MagasinModalContent />
                     }

                  </ModalBody>
                  <ModalFooter>
                     <Button color="danger" variant="light" onPress={onClose}>
                        Annuler
                     </Button>
                     <Button color="primary" onPress={handleModalValidation}>
                        Enregistrer
                     </Button>
                  </ModalFooter>
               </>
            )}
         </ModalContent>
      </Modal>
      <div className="w-full flex gap-5 pt-5 justify-center">
         <div className="w-3/5 flex flex-col gap-4 pb-8 border-solid border-1  border-gray-300 rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-thin">Informations générales de l'utilisateur</h1>
            <h1 className="text-small text-default-400 ml-1">Nom et prénoms</h1>
            <div className="flex gap-4">
               <Input value={usrNomSate} type="text" label="Nom" isRequired validationBehavior="aria" radius="sm" size="lg" variant="bordered" onChange={(e) => {
                  setUsrNom(e.target.value)
               }} />
               <Input value={usrPrenomState} type="text" label="Prénom" isRequired validationBehavior="aria" radius="sm" size="lg" variant="bordered" />
            </div>

            <Divider className="my-4" />
            <h1 className="text-small text-default-400 ml-1">Date </h1>
            <div className="flex  gap-4">
               <DatePicker value={dateCreation} label="Membre depuis" size="lg" variant="bordered" radius="sm"
                  isDisabled
               />
               <DatePicker label="Date de dernière accès" size="lg" variant="bordered" radius="sm" isDisabled />
            </div>

            <Divider className="my-4" />
            <h1 className="text-small text-default-400 ml-1">Role et informations de connections</h1>
            <div className="flex  gap-4">
               <Input onChange={(e) => setUsrLogin(e.target.value)} value={usrLoginState} type="text" label="Nom d'utilisateur" isClearable validationBehavior="aria" radius="sm" size="lg" variant="bordered" />
               <Input type="password" label="Mot de passe" isRequired isClearable
                  validationBehavior="aria" radius="sm" size="lg" variant="bordered"
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
                  selectedKeys={roleIdState ? [roleIdState.toString()] : []}
               >

                  {roles!.map((role) => (
                     <SelectItem key={role.roleId} value={role.roleId}>
                        {role.roleLi}
                     </SelectItem>
                  ))}
               </Select>
            </div>
            {/* <Divider className="my-4" />
         <h1 className="text-small text-default-400 ml-1">Service et Magasin</h1> */}
            <div className="w-3/6">
               <Button color="primary" variant="shadow" size="lg" className="h-[50px] " >
                  Enregistrez les modifications
               </Button>
            </div>
         </div>
         <div className="w-2/5  flex-col gap-4 pb-8 border-solid border-1  border-gray-300 rounded-lg shadow-md p-8">
            <div className="flex justify-between">
               <h1 className="text-3xl font-thin "> Services</h1>
               <Button onPress={() => handleModalOpen('service')} color="primary" variant="shadow" size="lg" className="h-[30px] rounded-md" >
                  Affectez à une service
               </Button>
            </div>

            <Table aria-label="Example static collection table" className="pt-5">
               <TableHeader columns={serviceColumns}>
                  {(column) => (
                     <TableColumn key={column.key}>

                        {column.label}
                     </TableColumn>
                  )}

               </TableHeader>
               <TableBody items={usrServiceExploitant!} emptyContent={"Cet utilisateur n'est affecté à aucune service"}>
                  {(item) => (
                     <TableRow key={item[serviceColumns[0].key]} >
                        {(columnKey) => (
                           <TableCell className="text-sm">{getKeyValue(item, columnKey)}</TableCell>
                        )}
                     </TableRow>
                  )}
               </TableBody>
            </Table>
            <Divider className="my-4" />
            <div className="flex justify-between">
               <h1 className="text-3xl font-thin ">Magasin</h1>
               <Button onPress={() => handleModalOpen('magasin')} color="primary" variant="shadow" size="lg" className="h-[30px] rounded-md" >
                  Affectez à un magasin
               </Button>
            </div>
            <Table aria-label="Example static collection table" className="pt-5" >
               <TableHeader columns={magasinColumns}>
                  {(column) => (
                     <TableColumn key={column.key}>
                        {column.label}
                     </TableColumn>
                  )}
               </TableHeader>
               <TableBody items={usrMagasins!} emptyContent={"Cet utilisateur n'est affecté à aucun magasin"}>
                  {(item) => (
                     <TableRow key={item[magasinColumns[0].key]} >
                        {(columnKey) => (
                           <TableCell className="text-sm">{getKeyValue(item, columnKey)}</TableCell>
                        )}
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>
      </div>
   </>
}