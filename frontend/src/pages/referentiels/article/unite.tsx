import { faRuler } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { DatePicker } from "@nextui-org/date-picker";
import { Input } from "@nextui-org/input";
import {
  now,
  getLocalTimeZone,
  DateValue,
  fromDate,
  toZoned,
} from "@internationalized/date";
import { useNavigate } from "react-router-dom";

import { UniteDataProps } from "@/types/types";
import {
  createUnite,
  deleteUnite,
  getAllUnite,
  updateUnite,
} from "@/services/api/article.service";
import CrudComponent from "@/components/features/crud-components";

export default function UnitePage() {
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;
  const size = searchParams.get("size")
    ? parseInt(searchParams.get("size")!)
    : 5;
  const [totalPage, setTotalPage] = useState<number>();
  const [isNewRowAdded, setIsNewRowAdded] = useState(false);
  const [label, setLabel] = useState("");
  const [abbr, setAbbr] = useState("");
  const [dateCreation, setDateCreation] = useState<DateValue>(
    now(getLocalTimeZone()),
  );
  //const [commentaire, setCommentaire] = useState('')
  const [isValidLabel, setIsValidLabel] = useState(false);
  const [rowToUpdate, setRowToUpdate] = useState<number | null>(null);

  const navigate = useNavigate();

  const [data, setData] = useState<UniteDataProps[] | null>([]);

  useEffect(() => {
    getAllUnite({ page, size })
      .then((response) => {
        console.table(response);
        setData(response.unites);
        const realPage = Math.ceil(response.totalPages / size);

        setTotalPage(realPage);
      })
      .catch((error) => {
        toast.error("Erreur lors de la récupération des données ", error);
      });
  }, [isNewRowAdded, page, size]);

  useEffect(() => {
    if (rowToUpdate) {
      const row = data!.find(
        (row: UniteDataProps) => row.uniteId === rowToUpdate,
      );

      if (row) {
        setLabel(row.uniteLi.trim());
        setAbbr(row.uniteAbrv.trim());
        const calendarDate = fromDate(new Date(row.uniteDtCr), "UTC");
        const dateValue = toZoned(calendarDate, "UTC");

        setDateCreation(dateValue);
      }
    }
  }, [rowToUpdate]);

  const columns = [
    {
      key: "uniteId",
      label: "Unité Id",
      type: "integer",
    },
    {
      key: "uniteLi",
      label: "Libellé",
      type: "string",
    },
    {
      key: "uniteAbrv",
      label: "Abbréviation",
      type: "string",
    },
  ];

  const onRowDelete = async (id: number) => {
    await deleteUnite(id).then((response) => {
      console.log(response);
      setIsNewRowAdded(!isNewRowAdded);
      toast.success("Unité supprimée avec succès");
    });
  };

  const createNewUnite = async () => {
    if (label === "") {
      setIsValidLabel(true);

      return;
    }

    setIsValidLabel(false);
    await createUnite(label, abbr, dateCreation!.toDate(getLocalTimeZone()), "")
      .then((response) => {
        console.log(response);
        setIsNewRowAdded(!isNewRowAdded);
        toast.success("Unité ajoutée avec succès");
      })
      .catch((error) => {
        toast.error("Erreur lors de l'ajout de l'unité ", error);
      });
  };

  const onPageChange = (page: number) => {
    searchParams.set("page", page.toString());
    searchParams.set("size", size.toString());
    const updatedUrl = `${location.pathname}?${searchParams.toString()}`;

    navigate(updatedUrl);
  };

  const onRowUpdate = async () => {
    if (label === "") {
      setIsValidLabel(true);

      return;
    }
    await updateUnite(
      rowToUpdate!,
      label,
      abbr,
      dateCreation!.toDate(getLocalTimeZone()),
      "",
    ).then((response) => {
      console.log(response);
      setIsNewRowAdded(!isNewRowAdded);
      toast.success("Unité modifiée avec succès");
    });
  };

  return (
    <CrudComponent
      isDeleteAuthorized
      isUpdateAuthorized
      addModalContent={
        <div className="w-full flex flex-col gap-4 pb-5">
          <Input
            isClearable
            isRequired
            isInvalid={isValidLabel}
            label="Libellé"
            radius="sm"
            size="lg"
            type="text"
            validationBehavior="aria"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <Input
            isClearable
            isRequired
            label="Abréviation"
            radius="sm"
            size="lg"
            type="text"
            validationBehavior="aria"
            value={abbr}
            onChange={(e) => setAbbr(e.target.value)}
          />

          <DatePicker
            hideTimeZone
            showMonthAndYearPickers
            defaultValue={dateCreation}
            label="Date de création"
            radius="sm"
            size="lg"
            value={dateCreation}
            onChange={(e) => {
              console.log(e);
              setDateCreation(e);
            }}
          />
        </div>
      }
      columns={columns}
      dataAbbreviation="unite"
      initialPage={page}
      pageIcon={<FontAwesomeIcon icon={faRuler} />}
      pageTitle="Unité"
      pages={totalPage}
      resetInput={() => {
        setAbbr("");
        setLabel("");
      }}
      rowsData={data as Record<string, any>[]}
      setRowToUpdate={setRowToUpdate}
      onAdd={createNewUnite}
      onPageChange={onPageChange}
      onRowDelete={onRowDelete}
      onRowUpdate={onRowUpdate}
      onSearch={() => {}}
    />
  );
}
