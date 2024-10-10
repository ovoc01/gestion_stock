import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

import {
  EmplacementDataProps,
  MagasinDataProps,
  ServiceExploitantDataProps,
} from "@/types/types";
import { getAllServiceExploitant } from "@/services/api/service-exploitant.service";
import {
  createEmplacement,
  deleteEmplacement,
  getAllEmplacements,
  getAllMagasins,
  updateEmplacement,
} from "@/services/api/batiment.service";
import CrudComponent from "@/components/features/crud-components";
export default function EmplacementPage() {
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;
  const size = searchParams.get("size")
    ? parseInt(searchParams.get("size")!)
    : 5;
  const [label, setLabel] = useState("");
  const [magId, setMagId] = useState<number | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [isNewRowAdded, setIsNewRowAdded] = useState(false);

  const [rowToUpdate, setRowToUpdate] = useState<number | null>(null);
  const [requestError, setRequestError] = useState<any>(null);

  const [serviceExploitants, setServiceExploitants] = useState<
    ServiceExploitantDataProps[] | null
  >([]);
  const [magasins, setMagasins] = useState<MagasinDataProps[] | null>([]);
  const [data, setData] = useState<EmplacementDataProps[] | null>([]);
  const [totalPage, setTotalPage] = useState<number>();

  const [shouldCloseModal, setShouldCloseModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getAllServiceExploitant({ page, size })
      .then((response) => {
        setServiceExploitants(response.serviceExploitants);
        setTotalPage(Math.ceil(response.totalPages / size));
      })
      .catch((error) => {
        toast.error("Erreur lors de la récupération des données ", error);
      });

    getAllMagasins({ page, size })
      .then((response) => {
        setMagasins(response.magasins);
      })
      .catch((error) => {
        toast.error("Erreur lors de la récupération des données ", error);
      });
  }, []);

  useEffect(() => {
    if (rowToUpdate) {
      const row = data!.find(
        (row: EmplacementDataProps) => row.emplId === rowToUpdate,
      );

      if (row) {
        setLabel(row.emplLi);
        setServiceId(row.serviceId);
        setMagId(row.magId);
      }
    }
  }, [rowToUpdate]);

  useEffect(() => {
    getAllEmplacements({ page, size })
      .then((response) => {
        setData(response.emplacements);
      })
      .catch((error) => {
        toast.error("Erreur lors de la récupération des données ", error);
      });
  }, [isNewRowAdded, page, size]);

  const columns = [
    {
      key: "emplId",
      label: "Emplacement Id",
      type: "integer",
    },
    {
      key: "emplLi",
      label: "Libellé",
      type: "string",
    },
    {
      key: "magLi",
      label: "Magasin",
    },
    {
      key: "serviceLi",
      label: "Service",
    },
    {
      key: "emplDtCr",
      label: "Date de création",
    },
  ];

  const createNewEmplacement = async () => {
    setShouldCloseModal(false);
    await createEmplacement(label, magId!, serviceId!)
      .then((response) => {
        toast.success("Emplacement ajouté avec succès", response);
        setIsNewRowAdded(!isNewRowAdded);
        setShouldCloseModal(true);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            setRequestError(error.response.data);
          }
        }
        console.log("vody");
        throw error;
      });
  };

  const onRowDelete = async (emplId: number) => {
    setShouldCloseModal(false);
    await deleteEmplacement(emplId)
      .then((response) => {
        toast.success("Emplacement supprimé avec succès", response);
        setIsNewRowAdded(!isNewRowAdded);
        setShouldCloseModal(true);
      })
      .catch((error) => {
        toast.error("Erreur lors de la suppression de l'emplacement", error);
      });
  };

  const onRowUpdate = async () => {
    setShouldCloseModal(false);
    await updateEmplacement(rowToUpdate!, label, magId!, serviceId!)
      .then((response) => {
        toast.success("Emplacement modifié avec succès", response);
        setIsNewRowAdded(!isNewRowAdded);
        setRowToUpdate(null);
        setShouldCloseModal(true);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            setRequestError(error.response.data);
          }
        }
      });
  };

  const onPageChange = (page: number) => {
    searchParams.set("page", page.toString());
    searchParams.set("size", size.toString());
    const updatedUrl = `${location.pathname}?${searchParams.toString()}`;

    navigate(updatedUrl);
  };

  return (
    <CrudComponent
      isUpdateAuthorized
      addModalContent={
        <div className="w-full flex flex-col gap-4 pb-5">
          <Select
            errorMessage={requestError?.serviceIdError}
            isInvalid={
              requestError?.serviceIdError !== null &&
              requestError?.serviceIdError !== undefined
            }
            label="Services"
            selectedKeys={serviceId ? [serviceId.toString()] : []}
            variant="bordered"
            onChange={(e) => {
              setServiceId(parseInt(e.target.value));
            }}
          >
            {serviceExploitants!.map((service) => (
              <SelectItem key={service.serviceId} value={service.serviceId}>
                {service.serviceLi}
              </SelectItem>
            ))}
          </Select>

          <Select
            errorMessage={requestError?.magIdError}
            isInvalid={
              requestError?.magIdError !== null &&
              requestError?.magIdError !== undefined
            }
            label="Magasins"
            selectedKeys={magId ? [magId.toString()] : []}
            variant="bordered"
            onChange={(e) => {
              setMagId(parseInt(e.target.value));
            }}
          >
            {magasins!.map((mag) => (
              <SelectItem key={mag.magId} value={mag.magId}>
                {mag.magLi}
              </SelectItem>
            ))}
          </Select>
          <Input
            errorMessage={requestError?.emplLiError}
            isInvalid={
              requestError?.emplLiError !== null &&
              requestError?.emplLiError !== undefined
            }
            label="Libellé"
            radius="sm"
            size="md"
            type="text"
            validationBehavior="aria"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
      }
      columns={columns}
      dataAbbreviation="empl"
      pageIcon={<FontAwesomeIcon icon={faMapLocationDot} />}
      pageTitle="Emplacement"
      pages={totalPage}
      resetInput={() => {
        setLabel("");
        setServiceId(null);
        setMagId(null);
        setRowToUpdate(null);
        setRequestError(null);
      }}
      rowsData={data as Record<string, any>[]}
      setRowToUpdate={setRowToUpdate}
      shouldCloseModal={shouldCloseModal}
      onAdd={createNewEmplacement}
      onPageChange={onPageChange}
      onRowDelete={onRowDelete}
      onRowUpdate={onRowUpdate}
      onSearch={() => {}}
    />
  );
}
