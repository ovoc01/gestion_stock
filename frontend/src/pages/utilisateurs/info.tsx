import { faBuildingShield, faEye, faEyeSlash, faStore, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "@nextui-org/input";
import {
   Button,
   Checkbox,
   DatePicker,
   Divider,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader,
   Select,
   SelectItem,
   useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLocalTimeZone, fromDate, DateValue } from "@internationalized/date";

import {
   MagasinDataProps,
   RoleDataProps,
   RowData,
   ServiceExploitantDataProps,
   UserInfoProps,
} from "@/types/types";
import { getAllRoles } from "@/services/api/admin.service";
import {
   addUserToService,
   getAllServiceExploitant,
   getAllUsrServiceExploitant,
} from "@/services/api/service-exploitant.service";
import {
   addUtilisateurToMagasin,
   getAllMagasins,
   getAllUtilisateurMagasins,
} from "@/services/api/batiment.service";
import { toast } from "sonner";
export function UserInfo() {
   //hooks initialisation

   const location = useLocation();
   const user = location.state as UserInfoProps;

   //static var initialisation
   const { usrNom, usrPrenom, usrLogin, roleId } = user;
   const { page, size } = { page: 1, size: 5 };
   const serviceColumns = [
      {
         key: "serviceLi",
         label: "SERVICE",
         type: "string",
      },

      {
         key: "depuisr",
         label: "Depuis quand",
         type: "string",
      },
   ];

   const magasinColumns = [
      {
         key: "magLi",
         label: "MAGASIN",
         type: "string",
      },
      {
         key: "depuis",
         label: "DEPUIS",
         type: "string",
      },
   ];

   //state initialisation
   const [usrNomSate, setUsrNom] = useState(usrNom);
   const [usrPrenomState] = useState(usrPrenom);
   const [usrLoginState, setUsrLogin] = useState(usrLogin);
   const [roleIdState] = useState(roleId);
   const [isUserDataChanged, setIsUserDataChanged] = useState(false);
   const { isOpen, onOpen, onOpenChange } = useDisclosure();
   const [isVisible, setIsVisible] = useState(false);
   const [userDetails] = useState<UserInfoProps>(user);
   const [dateCreation] = useState<DateValue>(
      fromDate(new Date(user.usrDtCr), getLocalTimeZone()),
   );
   const [roles, setRoles] = useState<RoleDataProps[] | null>([]);
   const [acitiveModalContent, setActiveModalContent] = useState<string | null>(
      null,
   );

   const [serviceId, setServiceId] = useState<number | null>(null);
   const [magasinId, setMagasinId] = useState<number | null>(null);

   const [services, setServices] = useState<ServiceExploitantDataProps[] | null>(
      [],
   );
   const [magasins, setMagasins] = useState<MagasinDataProps[] | null>(null);

   const [usrServiceExploitant, setUsrServiceExploitant] = useState<
      RowData[] | null
   >([]);
   const [usrMagasins, setUsrMagasins] = useState<RowData[] | null>([]);

   const [isBtnLoading, setIsBtnLoading] = useState(false);



   //useEffect call
   useEffect(() => {
      getAllRoles().then((response) => {
         setRoles(response.roles);
      });

      getAllUsrServiceExploitant(userDetails.usrId)
         .then((response) => {
            const d = response.services as Record<string, any>[];

            setUsrServiceExploitant(d);
         })
         .catch((error) => {
            console.error("Erreur lors de la récupération des données ", error);
         });

      getAllUtilisateurMagasins(userDetails.usrId).then((response) => {
         const d = response.magasins as Record<string, any>[];

         setUsrMagasins(d);
      });
   }, [isUserDataChanged]);



   useEffect(() => {
      getAllServiceExploitant({ page, size })
         .then((response) => {
            setServices(response.serviceExploitants);
         })
         .catch((error) => {
            console.error("Erreur lors de la récupération des données ", error);
         });

      getAllMagasins({ page, size })
         .then((response) => {
            setMagasins(response.magasins);
         })
         .catch((error) => {
            console.error("Erreur lors de la récupération des données ", error);
         });
   }, [acitiveModalContent]);

   //functions
   const toggleVisibility = () => setIsVisible(!isVisible);
   const handleModalOpen = (activeModalContent: string) => {
      setActiveModalContent(activeModalContent);
      onOpen();
   };

   const handleModalValidation = () => {
      if (acitiveModalContent === "service") {
         addUserToService(userDetails.usrId, serviceId!).catch((error) => {
            console.log("error", error);
         });
      } else {
         addUtilisateurToMagasin(userDetails.usrId, magasinId!).catch((error) => {
            console.log("error", error);
         });
      }
      setIsUserDataChanged(!isUserDataChanged);
   };

   const onAccountDeactivation = () => {
      setIsBtnLoading(true);
      setTimeout(() => {
         setIsBtnLoading(false);
         toast.info("Compte désactivé avec succès");
      }, 2000);
   }


   // Nested components arrow functions
   const ServiceModalContent = () => {
      return (
         <>
            <Select
               label="Services"
               selectedKeys={serviceId ? [serviceId.toString()] : []}
               onChange={(e) => {
                  setServiceId(parseInt(e.target.value));
               }}
            >
               {services!.map((service) => (
                  <SelectItem key={service.serviceId} value={service.serviceId}>
                     {service.serviceLi}
                  </SelectItem>
               ))}
            </Select>
         </>
      );
   };

   const MagasinModalContent = () => {
      return (
         <>
            <Select
               label="Magasins"
               selectedKeys={magasinId ? [magasinId.toString()] : []}
               onChange={(e) => {
                  setMagasinId(parseInt(e.target.value));
               }}
            >
               {magasins!.map((magasin) => (
                  <SelectItem key={magasin.magId} value={magasin.magId}>
                     {magasin.magLi}
                  </SelectItem>
               ))}
            </Select>
         </>
      );
   };





   return (
      <>
         <Modal isOpen={isOpen} size="xl" onOpenChange={onOpenChange}>
            <ModalContent>
               {(onClose) => (
                  <>
                     <ModalHeader className="flex flex-col gap-1">
                        Listes des services
                     </ModalHeader>
                     <ModalBody>
                        {acitiveModalContent === "service" ? (
                           <ServiceModalContent />
                        ) : (
                           <MagasinModalContent />
                        )}
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

         <div className="w-full flex gap-5 pt-5 ">

            <div className="w-4/5 flex flex-col gap-4 pb-8 border-solid border-1  border-gray-300 rounded-lg shadow-md p-8">
               <h1 className="text-3xl font-thin">
                  Informations générales de l'utilisateur
               </h1>
               <h1 className="text-small text-default-400 ml-1">Nom et prénoms</h1>
               <div className="flex gap-4">
                  <Input
                     isRequired
                     label="Nom"
                     radius="sm"
                     size="sm"
                     type="text"
                     validationBehavior="aria"
                     value={usrNomSate}
                     variant="bordered"
                     onChange={(e) => {
                        setUsrNom(e.target.value);
                     }}
                  />
                  <Input
                     isRequired
                     label="Prénom"
                     radius="sm"
                     size="sm"
                     type="text"
                     validationBehavior="aria"
                     value={usrPrenomState}
                     variant="bordered"
                  />
               </div>

               <Divider className="my-4" />
               <h1 className="text-small text-default-400 ml-1">Date </h1>
               <div className="flex  gap-4">
                  <DatePicker
                     isDisabled
                     label="Membre depuis"
                     radius="sm"
                     size="sm"
                     value={dateCreation}
                     variant="bordered"
                  />
                  <DatePicker
                     isDisabled
                     label="Date de dernière accès"
                     radius="sm"
                     size="sm"
                     variant="bordered"
                  />
               </div>

               <Divider className="my-4" />
               <h1 className="text-small text-default-400 ml-1">
                  Role et informations de connections
               </h1>
               <div className="flex  gap-4">
                  <Input
                     isClearable
                     label="Nom d'utilisateur"
                     radius="sm"
                     size="sm"
                     type="text"
                     validationBehavior="aria"
                     value={usrLoginState}
                     variant="bordered"
                     onChange={(e) => setUsrLogin(e.target.value)}
                  />
                  <Input
                     isClearable
                     isRequired
                     endContent={
                        <button
                           aria-label="toggle password visibility"
                           className="focus:outline-none"
                           type="button"
                           onClick={toggleVisibility}
                        >
                           {isVisible ? (
                              <FontAwesomeIcon icon={faEye} />
                           ) : (
                              <FontAwesomeIcon icon={faEyeSlash} />
                           )}
                        </button>
                     }
                     label="Mot de passe"
                     radius="sm"
                     size="sm"
                     type="password"
                     validationBehavior="aria"
                     variant="bordered"
                  />
               </div>
               <div className="flex w-3/6  gap-4">
                  <Select
                     label="Role de l'utilisateur"
                     selectedKeys={roleIdState ? [roleIdState.toString()] : []}
                     size="sm"
                     variant="bordered"
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
               <div className="w-4/6 flex gap-10 mt-5">
                  <Button
                     className="h-[40px] px-5"
                     color="primary"
                     size="sm"
                     variant="shadow"
                     radius="sm"
                  >
                     Enregistrez les modifications
                  </Button>
                  <Button
                     className="h-[40px] px-5"
                     color="secondary"
                     size="sm"
                     radius="sm"
                     variant="bordered"

                  >
                     Annulez
                  </Button>
               </div>
            </div>
         </div>
         <div className="w-full mt-5 p-5 h-[300px] shadow-lg rounded-md  border-solid border-1  border-gray-300 flex flex-col gap-6">
            <h1 className=" font-semibold text-gray-500">
               Désactivation de compte
            </h1>
            <div className=" w-full h-fit rounded-md p-5 text-sm"
               style={{
                  backgroundColor: '#fff2d6',
                  color: '#ffab00',
                  borderColor: '#ffe6b3'
               }}>
               <h1 > Êtes-vous sûr de vouloir supprimer ce compte ?</h1>
               <h1 className="font-light">
                  Une fois que vous supprimez ce compte, il n'y a pas de retour en arrière. Veuillez en être certain.
               </h1>
            </div>
            <div className="flex flex-col justify-start w-full gap-3 ">
               <Checkbox
                  radius="sm"
                  onClick={() => { }}
               >
                  Je confirme la désactivation de ce compte
               </Checkbox>
            </div>
            <div className=" w-[200px]">
               <Button
                  className="font-normal text-sm px-5"
                  color="danger"
                  size="md"
                  variant="flat"
                  radius="sm"
                  isLoading={isBtnLoading}
                  onClick={() => {
                     onAccountDeactivation()
                  }}
               >
                  Désactiver ce compte
               </Button>
            </div>
         </div>
      </>
   );
}


