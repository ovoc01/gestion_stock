import { faCube } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, Select, SelectItem } from "@nextui-org/react";
import {
  now,
  getLocalTimeZone,
  DateValue,
  fromDate,
  toZoned,
} from "@internationalized/date";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FamilleDataProps, SousFamilleDataProps } from "@/types/types";
import {
  createSousFamille,
  deleteSousFamille,
  getAllFamilles,
  getAllSousFamilles,
  updateSousFamille,
} from "@/services/api/article.service";
import CrudComponent from "@/components/features/crud-components";
export default function SousFamillePage() {
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;
  const size = searchParams.get("size")
    ? parseInt(searchParams.get("size")!)
    : 5;
  const [rowToUpdate, setRowToUpdate] = useState<number | null>(null);

  const [totalPage, setTotalPage] = useState<number>();
  const [label, setLabel] = useState("");
  const [familleId, setFamilleId] = useState<number | null>(null);
  const [dateCreation, setDateCreation] = useState<DateValue>(
    now(getLocalTimeZone()),
  );
  const [isNewRowAdded, setIsNewRowAdded] = useState(false);

  const [requestError, setRequestError] = useState<any>(null);

  const navigate = useNavigate();

  const [data, setData] = useState<SousFamilleDataProps[] | null>([]);

  const [familles, setFamilles] = useState<FamilleDataProps[] | null>([]);

  useEffect(() => {
    console.log("response 2");
    getAllFamilles({ page, size })
      .then((response) => {
        console.log("response");
        setFamilles(response.familles);
      })
      .catch((error) => {
        toast.error("Erreur lors de la récupération des données ", error);
      });
  }, []);

  useEffect(() => {
    getAllSousFamilles({ page, size }).then((response) => {
      setData(response.sousFamilles);
      const realPage = Math.ceil(response.totalPages / size);

      setTotalPage(realPage);
    });
  }, [page, size, isNewRowAdded]);

  useEffect(() => {
    if (rowToUpdate) {
      console.log("rowToUpdate", rowToUpdate);
      const row = data!.find(
        (row: SousFamilleDataProps) => row.sousFamId === rowToUpdate,
      );

      if (row) {
        setLabel(row.sousFamLi.trim());
        setFamilleId(row.familleId);
        const calendarDate = fromDate(new Date(row.sousFamDtCr), "UTC");
        const dateValue = toZoned(calendarDate, "UTC");

        setDateCreation(dateValue);
      }
    }
  }, [rowToUpdate]);

  const columns = [
    {
      key: "sousFamId",
      label: "Sous Famille Id",
      type: "integer",
    },
    {
      key: "familleLi",
      label: "Famille",
      type: "string",
    },
    {
      key: "sousFamLi",
      label: "Libellé",
      type: "string",
    },
    {
      key: "sousFamDtCr",
      label: "Date de création",
      type: "string",
    },
  ];

  const createSousNewFamille = async () => {
    await createSousFamille(
      familleId!,
      label,
      dateCreation!.toDate(getLocalTimeZone()),
    )
      .then(() => {
        toast.success("La sous famille a été ajoutée avec succès");
        setLabel("");
        setFamilleId(null);
        setDateCreation(now(getLocalTimeZone()));
        setIsNewRowAdded(!isNewRowAdded);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            setRequestError(error.response.data);
          }
        }
      });
  };

  const onRowDelete = async (id: number) => {
    await deleteSousFamille(id)
      .then((response) => {
        console.log(response);
        setIsNewRowAdded(!isNewRowAdded);
        toast.success("Sous Famille supprimée avec succès");
      })
      .catch((error) => {
        toast.error("Erreur lors de la suppression de la sous famille ", error);
      });
  };

  const onPageChange = (page: number) => {
    searchParams.set("page", page.toString());
    searchParams.set("size", size.toString());
    const updatedUrl = `${location.pathname}?${searchParams.toString()}`;

    navigate(updatedUrl);
  };

  const onRowUpdate = async () => {
    if (label.trim() === "") {
      toast.error("Le libellé est obligatoire");

      return;
    }
    await updateSousFamille(
      rowToUpdate!,
      familleId!,
      label,
      dateCreation!.toDate(getLocalTimeZone()),
    )
      .then(() => {
        toast.success("Sous Famille modifiée avec succès");
        setIsNewRowAdded(!isNewRowAdded);
        setRowToUpdate(null);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            setRequestError(error.response.data);
          }
        }
      });
  };

  const resetInput = () => {
    setLabel("");
    setFamilleId(null);
    setDateCreation(now(getLocalTimeZone()));
    setRequestError(null);
  };

  return (
    <CrudComponent
      isDeleteAuthorized
      isUpdateAuthorized
      addModalContent={
        <div className="w-full flex flex-col gap-4 pb-5">
          <Select
            errorMessage={requestError?.familleIdError}
            isInvalid={
              requestError?.familleIdError !== null &&
              requestError?.familleIdError !== undefined
            }
            label="Listes des Familles"
            selectedKeys={familleId ? [familleId.toString()] : []}
            onChange={(e) => {
              setFamilleId(parseInt(e.target.value));
            }}
          >
            {familles!.map((famille) => (
              <SelectItem key={famille.familleId} value={famille.familleId}>
                {famille.familleLi}
              </SelectItem>
            ))}
          </Select>

          <Input
            isClearable
            isRequired
            errorMessage={requestError?.sousFamLiError}
            isInvalid={
              requestError?.sousFamLiError !== null &&
              requestError?.sousFamLiError !== undefined
            }
            label="Libellé"
            radius="sm"
            size="lg"
            type="text"
            validationBehavior="aria"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
      }
      columns={columns}
      dataAbbreviation="sousFam"
      initialPage={page}
      pageIcon={<FontAwesomeIcon icon={faCube} />}
      pageTitle="Sous Famille"
      pages={totalPage}
      resetInput={resetInput}
      rowsData={data as Record<string, any>[]}
      setRowToUpdate={setRowToUpdate}
      onAdd={createSousNewFamille}
      onPageChange={onPageChange}
      onRowDelete={onRowDelete}
      onRowUpdate={onRowUpdate}
      onSearch={() => {}}
    />
  );
}
