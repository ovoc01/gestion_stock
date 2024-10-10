import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Checkbox, Divider } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

import Map, { MapMarker } from "@/components/features/map";
import { UniteOperationnelDataProps } from "@/types/types";
import {
  createUniteOperationnel,
  deleteUniteOperationnel,
  getAllUniteOperationnel,
  updateUniteOperationnel,
} from "@/services/api/unite-operationnel.service";
import CrudComponent from "@/components/features/crud-components";
export default function UniteOperationnelPage() {
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;
  const size = searchParams.get("size")
    ? parseInt(searchParams.get("size")!)
    : 5;

  const navigate = useNavigate();

  const [label, setLabel] = useState("");
  const [numbu, setNumbu] = useState<string | null>("");
  const [buli, setBuli] = useState<string | null>("");
  const [numAffaire, setNumAffaire] = useState<string | null>("");
  const [ue, setUE] = useState<string | null>("");
  const [ueLi, setUELi] = useState<string | null>("");
  const [mdmId, setMdmId] = useState<string | null>("");

  const [totalPage, setTotalPage] = useState<number>();
  const [isNewRowAdded, setIsNewRowAdded] = useState(false);
  const [rowToUpdate, setRowToUpdate] = useState<number | null>(null);
  const [isDefaultEmplacement, setIsDefaultEmplacement] = useState(true);

  const [unopPosition] = useState<{ lat: number; lng: number } | null>({
    lat: -18.870134,
    lng: 47.5205636,
  });

  const [data, setData] = useState<UniteOperationnelDataProps[] | null>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);

  const [marker, setMarker] = useState<MapMarker | null>(null);

  const [resquestError, setRequestError] = useState<any>(null);
  const [shouldCloseModal, setShouldCloseModal] = useState(false);

  useEffect(() => {
    getAllUniteOperationnel({ page, size })
      .then((response) => {
        setData(response.uniteOperationnels);

        for (let i = 0; i < response.uniteOperationnels.length; i++) {
          setMarkers((prev) => [
            ...prev,
            {
              position: {
                lat: response.uniteOperationnels[i].unopLtd,
                lng: response.uniteOperationnels[i].unopLng,
              },
            },
          ]);
        }

        setTotalPage(Math.ceil(response.totalPages / size));
      })
      .finally(() => {});
  }, [isNewRowAdded, page, size]);

  useEffect(() => {
    if (rowToUpdate) {
      const row = data!.find(
        (row: UniteOperationnelDataProps) => row.unopId === rowToUpdate,
      );

      console.log(row);
      if (row) {
        setLabel(row.unopLi.trim());
        setNumbu(row.unopNumBu);
        setBuli(row.unopLiNumAff);
        setNumAffaire(row.unopLiNumAff);
        setMdmId(row.unopMdmId);
        setUE(row.unopUe);
        setUELi(row.unopUeLi);
        setMarker({ position: { lat: row.unopLtd!, lng: row.unopLng! } });
      }
    }
  }, [rowToUpdate]);

  const columns = [
    {
      key: "unopId",
      label: "Unité operationnel ID",
      type: "integer",
    },
    {
      key: "unopRef",
      label: "Reference",
      type: "string",
    },
    {
      key: "unopNumBu",
      label: "Numéro Bu",
      type: "integer",
    },
    {
      key: "unopLi",
      label: "Libéllé",
      type: "string",
    },
    {
      key: "unopLiNumAff",
      label: "Numero Affaire",
      type: "string",
    },
  ];

  const createNewUnOp = async () => {
    setShouldCloseModal(false);
    const { lng, lat } = marker
      ? marker.position
      : { lng: unopPosition?.lng, lat: unopPosition?.lat };

    await createUniteOperationnel(
      numbu!,
      buli!,
      numAffaire!,
      mdmId!,
      label!,
      { lng: lng!, lat: lat! },
      ue!,
      ueLi!,
    )
      .then(() => {
        setIsNewRowAdded(!isNewRowAdded);
        toast.message("Unité operationnel ajoutée");
        setShouldCloseModal(true);
      })
      .catch((error) => {
        setRequestError(error.response.data);
        setTimeout(() => {
          setRequestError(null);
        }, 10000);
      });
  };

  const resetInput = () => {
    setLabel("");
    setNumbu("");
    setBuli("");
    setNumAffaire("");
    setMdmId("");
    setUE("");
    setUELi("");
    setRowToUpdate(null);
  };

  const onRowDelete = async (unopId: number) => {
    setShouldCloseModal(false);
    await deleteUniteOperationnel(unopId)
      .then(() => {
        toast.message("Unité operationnel supprimée");
        setIsNewRowAdded(!isNewRowAdded);
        setShouldCloseModal(true);
      })
      .catch((error) => {
        toast.error(
          "Erreur lors de la suppression de l'unité operationnel",
          error,
        );
      });
  };

  const onRowUpdate = async () => {
    const { lng, lat } = marker
      ? marker.position
      : { lng: unopPosition?.lng, lat: unopPosition?.lat };

    setShouldCloseModal(false);

    await updateUniteOperationnel(
      rowToUpdate!,
      numbu!,
      buli!,
      numAffaire!,
      mdmId!,
      label!,
      { lng: lng!, lat: lat! },
      ue!,
      ueLi!,
    )
      .then(() => {
        setIsNewRowAdded(!isNewRowAdded);
        toast.message("Unité operationnel modifiée");
        setRowToUpdate(null);
        setShouldCloseModal(true);
      })
      .catch((error) => {
        setRequestError(error.response.data);
        throw error;
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
      isDeleteAuthorized
      isUpdateAuthorized
      addModalContent={
        <div className="flex items-center  gap-4">
          <div className="w-3/6 flex flex-col gap-1 ">
            <h1 className="text-small text-default-400 ml-1">
              Informations du unité operationnel
            </h1>
            <div className="flex gap-4">
              <Input
                isRequired
                errorMessage={resquestError?.unopLiError}
                isInvalid={
                  resquestError?.unopLiError !== null &&
                  resquestError?.unopLiError !== undefined
                }
                label="Nom unité operationnel"
                type="text"
                value={label}
                variant="bordered"
                onChange={(e) => setLabel(e.target.value)}
              />
              <Input
                isRequired
                errorMessage={resquestError?.unopLiNumAffError}
                isInvalid={
                  resquestError?.unopLiNumAffError !== null &&
                  resquestError?.unopLiNumAffError !== undefined
                }
                label="Numero affaire"
                type="text"
                value={numAffaire!}
                variant="bordered"
                onChange={(e) => setNumAffaire(e.target.value)}
              />
            </div>
            <Divider className="my-4" />
            <h1 className="text-small text-default-400 ml-1">
              Informations BU
            </h1>
            <div className="flex gap-4">
              <Input
                isRequired
                errorMessage={resquestError?.unopNumBuError}
                isInvalid={
                  resquestError?.unopNumBuError !== null &&
                  resquestError?.unopNumBuError !== undefined
                }
                label="Numero bu"
                type="text"
                value={numbu!}
                variant="bordered"
                onChange={(e) => setNumbu(e.target.value)}
              />
            </div>
            <h1 className="text-small text-default-400 ml-1">
              Informations UE
            </h1>
            <div className="flex gap-4">
              <Input
                isRequired
                errorMessage={resquestError?.unopUeError}
                isInvalid={
                  resquestError?.unopUeError !== null &&
                  resquestError?.unopUeError !== undefined
                }
                label="UE"
                type="text"
                value={ue!}
                variant="bordered"
                onChange={(e) => setUE(e.target.value)}
              />
              <Input
                isRequired
                errorMessage={resquestError?.unopUeLiError}
                isInvalid={
                  resquestError?.unopUeLiError !== null &&
                  resquestError?.unopUeLiError !== undefined
                }
                label="Libéllé UE"
                type="text"
                value={ueLi!}
                variant="bordered"
                onChange={(e) => setUELi(e.target.value)}
              />
            </div>

            <h1 className="text-small text-default-400 ml-1">Mdm id</h1>
            <Input
              isRequired
              errorMessage={resquestError?.unopMdmIdError}
              isInvalid={
                resquestError?.unopMdmIdError !== null &&
                resquestError?.unopMdmIdError !== undefined
              }
              label="Mdm id"
              type="text"
              value={mdmId!}
              variant="bordered"
              onChange={(e) => setMdmId(e.target.value)}
            />

            <Divider className="my-2" />
            <h1 className="text-small text-default-400 ml-1">Coordonnée</h1>
            <div className="flex gap-4">
              <Input
                isDisabled
                isRequired
                label="Longitude"
                type="text"
                value={marker ? marker!.position.lng.toString() : ""}
                variant="bordered"
                onChange={(e) => setNumbu(e.target.value)}
              />
              <Input
                isDisabled
                isRequired
                label="Latitude"
                type="text"
                value={marker ? marker!.position.lat.toString() : ""}
                variant="bordered"
                onChange={(e) => setBuli(e.target.value)}
              />
            </div>
            <Checkbox
              className="my-2"
              isSelected={isDefaultEmplacement}
              radius="sm"
              onClick={() => setIsDefaultEmplacement(!isDefaultEmplacement)}
            >
              Emplacement par défaut{" "}
              <span className="text-sm">(Centre Anosibe)</span>{" "}
            </Checkbox>
          </div>
          <div className="w-4/6">
            <Map
              center={unopPosition!}
              markers={markers}
              setMarkers={setMarkers}
              setNewMarker={setMarker}
            />
          </div>
        </div>
      }
      columns={columns}
      dataAbbreviation="unop"
      extraComponent={<Map center={unopPosition!} markers={markers} />}
      modalClassName="max-w-[1200px]"
      pageIcon={<FontAwesomeIcon icon={faBuilding} />}
      pageTitle="Unité operationnel"
      pages={totalPage}
      resetInput={resetInput}
      rowsData={data as Record<string, any>[]}
      setRowToUpdate={setRowToUpdate}
      shouldCloseModal={shouldCloseModal}
      size="2xl"
      onAdd={createNewUnOp}
      onPageChange={onPageChange}
      onRowDelete={onRowDelete}
      onRowUpdate={onRowUpdate}
      onSearch={() => {}}
    />
  );
}
