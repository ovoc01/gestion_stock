import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "@nextui-org/input";
import {
  Button,
  DatePicker,
  Divider,
  getKeyValue,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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

export default function UserDetails() {
  const location = useLocation();
  const user = location.state as UserInfoProps;
  const { usrNom, usrPrenom, usrLogin, roleId } = user;

  const [usrNomSate, setUsrNom] = useState(usrNom);
  const [usrPrenomState] = useState(usrPrenom);
  const [usrLoginState, setUsrLogin] = useState(usrLogin);
  const [roleIdState] = useState(roleId);

  const [isUserDataChanged, setIsUserDataChanged] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isVisible, setIsVisible] = useState(false);

  const [userDetails] = useState<UserInfoProps>(user);

  const [dateCreation, setDateCreation] = useState<DateValue>(
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

  const { page, size } = { page: 1, size: 5 };

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

  const toggleVisibility = () => setIsVisible(!isVisible);

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
      <div className="w-full flex gap-5 pt-5 justify-center">
        <div className="w-3/5 flex flex-col gap-4 pb-8 border-solid border-1  border-gray-300 rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-thin">
            Informations générales de l'utilisateur
          </h1>
          <h1 className="text-small text-default-400 ml-1">Nom et prénoms</h1>
          <div className="flex gap-4">
            <Input
              isRequired
              label="Nom"
              radius="sm"
              size="lg"
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
              size="lg"
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
              size="lg"
              value={dateCreation}
              variant="bordered"
            />
            <DatePicker
              isDisabled
              label="Date de dernière accès"
              radius="sm"
              size="lg"
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
              size="lg"
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
              size="lg"
              type="password"
              validationBehavior="aria"
              variant="bordered"
            />
          </div>
          <div className="flex w-3/6  gap-4">
            <Select
              label="Role de l'utilisateur"
              selectedKeys={roleIdState ? [roleIdState.toString()] : []}
              size="lg"
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
          <div className="w-3/6">
            <Button
              className="h-[50px] "
              color="primary"
              size="lg"
              variant="shadow"
            >
              Enregistrez les modifications
            </Button>
          </div>
        </div>
        <div className="w-2/5  flex-col gap-4 pb-8 border-solid border-1  border-gray-300 rounded-lg shadow-md p-8">
          <div className="flex justify-between">
            <h1 className="text-3xl font-thin "> Services</h1>
            <Button
              className="h-[30px] rounded-md"
              color="primary"
              size="lg"
              variant="shadow"
              onPress={() => handleModalOpen("service")}
            >
              Affectez à une service
            </Button>
          </div>

          <Table aria-label="Example static collection table" className="pt-5">
            <TableHeader columns={serviceColumns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody
              emptyContent={"Cet utilisateur n'est affecté à aucune service"}
              items={usrServiceExploitant!}
            >
              {(item) => (
                <TableRow key={item[serviceColumns[0].key]}>
                  {(columnKey) => (
                    <TableCell className="text-sm">
                      {getKeyValue(item, columnKey)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Divider className="my-4" />
          <div className="flex justify-between">
            <h1 className="text-3xl font-thin ">Magasin</h1>
            <Button
              className="h-[30px] rounded-md"
              color="primary"
              size="lg"
              variant="shadow"
              onPress={() => handleModalOpen("magasin")}
            >
              Affectez à un magasin
            </Button>
          </div>
          <Table aria-label="Example static collection table" className="pt-5">
            <TableHeader columns={magasinColumns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody
              emptyContent={"Cet utilisateur n'est affecté à aucun magasin"}
              items={usrMagasins!}
            >
              {(item) => (
                <TableRow key={item[magasinColumns[0].key]}>
                  {(columnKey) => (
                    <TableCell className="text-sm">
                      {getKeyValue(item, columnKey)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
