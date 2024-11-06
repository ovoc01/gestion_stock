import { faEye, faEyeSlash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import {
  DatePicker,
  Divider,
  Select,
  SelectItem,
  Selection,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  MagasinDataProps,
  RegistrationPayload,
  RoleDataProps,
  ServiceExploitantDataProps,
  UserInfoProps,
} from "@/types/types";
import { getAllServiceExploitant } from "@/services/api/service-exploitant.service";
import { getAllMagasins } from "@/services/api/batiment.service";
import { registerUser } from "@/services/api/auth.service";
import { getAllRoles, getAllUtilisateurs } from "@/services/api/admin.service";
import { title } from "@/components/primitives";
import { SearchIcon } from "@/components/ui/icons"; // Assuming DefaultTable is in this path
import { DefaultTable } from "@/components/ui/table/default";

export default function UtilisateurPage() {
  const navigate = useNavigate();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const modalRef = useRef(null);

  const [data, setData] = useState([]);
  const [roles, setRoles] = useState<RoleDataProps[] | null>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<ServiceExploitantDataProps[] | null>(
    [],
  );
  const [magasins, setMagasins] = useState<MagasinDataProps[] | null>(null);
  const [usrNom, setUsrNom] = useState<string>("");
  const [usrPrenom, setUsrPrenom] = useState<string>("");
  const [usrLogin, setUsrLogin] = useState<string>("");
  const [usrPassword, setUsrPassword] = useState<string>("");
  const [role, setRole] = useState<number>();
  const [pageNeedReload, setPageNeedReload] = useState(false);

  const { page, size } = { page: 1, size: 5 };

  const onRowClick = (id: number, user: UserInfoProps) => {
    navigate(`/utilisateurs/${id}`, { state: user })
  }

  useEffect(() => {
    getAllUtilisateurs().then((response) => {

      if (response.users) {
        const usersWithOnClick = response.users.map((user: UserInfoProps) => ({
          ...user,
          onClick: () => onRowClick(user.usrId, user), // Add onClick to each user
        }));
        setData(usersWithOnClick);
      }
    });


    getAllRoles().then((response) => {
      setRoles(response.roles);
    });

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
  }, [pageNeedReload]);
  const chipClassName = [
    {
      key: 'active',
      class: 'bg-green-100 text-green-600'
    },
    {
      key: 'inactive',
      class: 'bg-red-100 text-red-600'
    },
    {
      key: 'pending',
      class: 'bg-yellow-100 text-yellow-600'
    }
  ]

  const columns = [
    {
      key: "usrId",
      label: "ID",
    },
    {
      key: "usrNom",
      label: "Nom",
    },
    {
      key: "usrPrenom",
      label: "Prénom",
    },
    {
      key: "usrLogin",
      label: "Nom d'utilisateur",
    },
    {
      key: "roleLi",
      label: "Rôle",
    },
  ];

  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isVisible, setIsVisible] = useState(false);

  const [selectedMagasins, setSelectedMagasins] = useState<Selection>(
    new Set([]),
  );
  const [selectedServices, setSelectedServices] = useState<Selection>(
    new Set([]),
  );

  const [requestError, setRequestError] = useState<any>(null);

  const filteredRows = data!.filter((row) => {
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase()),
    );
  });

  const handleUserRegistration = async (onClose: () => void) => {
    const magasinsSet = selectedMagasins as Set<number>;
    const serviceSet = selectedServices as Set<number>;

    let magAffect: number[] = [];
    let servAffect: number[] = [];

    serviceSet.forEach((y) => {
      servAffect.push(y);
    });

    magasinsSet.forEach((val) => {
      magAffect.push(val);
    });
    const userRegsitrationPayload: RegistrationPayload = {
      username: usrLogin,
      password: usrPassword,
      nom: usrNom,
      prenom: usrPrenom,
      roleId: role!,
      magAffect: magAffect,
      servAffect: servAffect,
    };

    await registerUser(userRegsitrationPayload)
      .then(() => {
        setPageNeedReload(!pageNeedReload);
        toast.success("Nouveau utilisateur enregistré");

        onClose();
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          setRequestError(error.response.data);
          setTimeout(() => {
            setRequestError(null);
          }, 4000);
        }
      });
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const resetInput = () => {
    setUsrPrenom("");
    setUsrNom("");
    setUsrPassword("");
    setUsrLogin("");
    setSelectedMagasins(new Set());
    setSelectedServices(new Set());
  };

  return (
    <>
      <Modal
        ref={modalRef}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        size="2xl"
        onOpenChange={() => {
          onOpenChange();
          resetInput();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Ajouter un nouveau utilisateur
              </ModalHeader>
              <ModalBody>
                {/* Nom et Prénom */}
                <h1 className="text-small text-default-400 ml-1">Nom et Prénoms</h1>
                <div className="flex gap-4">
                  <Input
                    isRequired
                    errorMessage={requestError?.nomError}
                    isInvalid={
                      requestError?.nomError !== null &&
                      requestError?.nomError !== undefined
                    }
                    label="Nom"
                    radius="sm"
                    size="sm"
                    type="text"
                    validationBehavior="aria"
                    value={usrNom}
                    variant="bordered"
                    onChange={(e) => {
                      setUsrNom(e.target.value);
                    }}
                  />
                  <Input
                    isRequired
                    errorMessage={requestError?.prenomError}
                    isInvalid={
                      requestError?.prenomError !== null &&
                      requestError?.prenomError !== undefined
                    }
                    label="Prénom"
                    radius="sm"
                    size="sm"
                    type="text"
                    validationBehavior="aria"
                    value={usrPrenom}
                    variant="bordered"
                    onChange={(e) => {
                      setUsrPrenom(e.target.value);
                    }}
                  />
                </div>

                <Divider className="my-4" />
                {/* Role and Connection Info */}
                <h1 className="text-small text-default-400 ml-1">Role et informations de connections</h1>
                <div className="flex gap-4">
                  <Input
                    isClearable
                    errorMessage={requestError?.usernameError}
                    isInvalid={
                      requestError?.usernameError !== null &&
                      requestError?.usernameError !== undefined
                    }
                    label="Nom d'utilisateur"
                    radius="sm"
                    size="sm"
                    type="text"
                    validationBehavior="aria"
                    value={usrLogin}
                    variant="bordered"
                    onChange={(e) => {
                      setUsrLogin(e.target.value);
                    }}
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
                    errorMessage={requestError?.passwordError}
                    isInvalid={
                      requestError?.passwordError !== null &&
                      requestError?.passwordError !== undefined
                    }
                    label="Mot de passe"
                    radius="sm"
                    size="sm"
                    type={isVisible ? "text" : "password"}
                    validationBehavior="aria"
                    value={usrPassword}
                    variant="bordered"
                    onChange={(e) => {
                      setUsrPassword(e.target.value);
                    }}
                  />

                </div>
                <div>
                  <Select
                    variant="bordered"
                    aria-label="Select Role"
                    label="Role"
                    size="sm"
                    required
                    value={role}
                    onChange={(e) => {
                      setRole(parseInt(e.target.value));
                    }}
                  >
                    {roles!.map((roleData) => (
                      <SelectItem key={roleData.roleId} value={roleData.roleId}>
                        {roleData.roleLi}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <Divider className="my-4" />
                {/* Magasins and Services */}
                <h1 className="text-small text-default-400 ml-1">Magasins</h1>
                <div className="flex gap-4 flex-col">
                  <Select
                    aria-label="Magasins"
                    label="Magasins"
                    size="sm"
                    selectedKeys={selectedMagasins}
                    selectionMode="multiple"
                    onSelectionChange={setSelectedMagasins}
                    multiple
                    required
                    variant="bordered"
                  >
                    {magasins!.map((mag) => (
                      <SelectItem key={mag.magId} value={mag.magId}>
                        {mag.magLi}
                      </SelectItem>
                    ))}
                  </Select>
                  <div className="flex gap-4">
                    <DatePicker
                      isRequired
                      label="Du"
                      radius="sm"
                      size="sm"
                      validationBehavior="aria"
                      variant="bordered"
                      onChange={() => { }}
                    />
                    <DatePicker
                      label="À"
                      radius="sm"
                      size="sm"
                      validationBehavior="aria"
                      variant="bordered"
                      onChange={() => { }}
                    />
                  </div>
                  <Divider className="my-4" />
                  <h1 className="text-small text-default-400 ml-1">Services</h1>
                  <div>
                    <Select
                      aria-label="Services"
                      label="Services"
                      size="sm"
                      selectionMode="multiple"
                      selectedKeys={selectedServices}
                      onSelectionChange={setSelectedServices}
                      multiple
                      required
                      variant="bordered"
                    >
                      {services!.map((service) => (
                        <SelectItem
                          key={service.serviceId}
                          value={service.serviceId}
                        >
                          {service.serviceLi}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Annulez
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleUserRegistration(onClose);
                  }}
                >
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
            <h1
              className={title()}
              style={{
                textTransform: "capitalize",
              }}
            />
          </div>
        </section>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-3 items-end">
            <Input
              isClearable
              classNames={{
                base: "w-full sm:max-w-[44%]",
                inputWrapper: "border-1",
              }}
              placeholder="Rechercher..."
              size="sm"
              startContent={<SearchIcon className="text-default-300" />}
              variant="bordered"
              onChange={handleSearch}
              onClear={() => {
                setSearchTerm("");
              }}
            />
            <Button
              className="bg-foreground text-background px-4 py-2"
              color="default"
              endContent={<FontAwesomeIcon icon={faPlus} />}
              size="sm"
              variant="flat"
              onPress={onOpen}
            >
              Ajouter
            </Button>
          </div>
        </div>

        <DefaultTable
          chipClassName={chipClassName}
          headers={columns.map(({ key, label }) => ({
            key,
            label,
            isChip: key === "roleLi", // Assuming roles should be displayed as chips
          }))}
          data={filteredRows}
          isWithPagination={true} // Enable pagination
          onNextBtnPress={() => {
            // Handle next page logic
          }}
          onPreviousBtnPress={() => {
            // Handle previous page logic
          }}
        />
      </div>
    </>
  );
}
