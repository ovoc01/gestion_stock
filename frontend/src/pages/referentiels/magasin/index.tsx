import { faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Input, Textarea } from "@nextui-org/input";
import {
  now,
  getLocalTimeZone,
  DateValue,
  fromDate,
  toZoned,
} from "@internationalized/date";
import { DatePicker } from "@nextui-org/date-picker";
import { useLocation, useNavigate } from "react-router-dom";

import DetailsMagasin from "./details";

import { MagasinDataProps } from "@/types/types";
import {
  createMagasin,
  deleteMagasin,
  getAllMagasins,
  updateMagasin,
} from "@/services/api/batiment.service";
import CrudComponent from "@/components/features/crud-components";
import { FetchType } from "@/shared/shared";

const Index = () => {
  const [label, setLabel] = useState("");
  const [dateCreation, setDateCreation] = useState<DateValue>(
    now(getLocalTimeZone()),
  );
  const [commentaire, setCommentaire] = useState("");

  const [isNewRowAdded, setIsNewRowAdded] = useState(false);
  const [totalPage, setTotalPage] = useState<number>();

  const location = useLocation();
  const navigate = useNavigate();

  const [requestError, setRequestError] = useState<any>(null);

  const [data, setData] = useState<MagasinDataProps[] | null>([]);
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;
  const size = searchParams.get("size")
    ? parseInt(searchParams.get("size")!)
    : 5;
  const idMagasin = searchParams.get("idMagasin")
    ? parseInt(searchParams.get("idMagasin")!)
    : null;

  const [rowToUpdate, setRowToUpdate] = useState<number | null>(null);
  const [shouldCloseModal, setShouldCloseModal] = useState(false);

  useEffect(() => {
    if (idMagasin === null) {
      getAllMagasins({ page, size, fetch: FetchType.PAGINATION })
        .then((response) => {
          console.table(response);
          setData(response.magasins);
          const realPage = Math.ceil(response.totalPages / size);

          setTotalPage(realPage);
        })
        .catch((error) => {
          toast.error("Erreur lors de la récupération des données ", error);
        });
    }
  }, [isNewRowAdded, page, size]);

  useEffect(() => {
    if (rowToUpdate && idMagasin === null) {
      const row = data!.find(
        (row: MagasinDataProps) => row.magId === rowToUpdate,
      );

      if (row) {
        setLabel(row.magLi);
        const calendarDate = fromDate(new Date(row.magDtCr), "UTC");
        const dateValue = toZoned(calendarDate, "UTC");

        setDateCreation(dateValue);
        setCommentaire(row.magCom ? row.magCom : "");
      }
    }
  }, [rowToUpdate]);

  const columns = [
    {
      key: "magId",
      label: "Magasin Id",
      type: "integer",
    },
    {
      key: "magLi",
      label: "Libellé",
      type: "string",
    },
    {
      key: "magDtCr",
      label: "Date de création",
    },
  ];

  const onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const createNewFamille = async () => {
    setShouldCloseModal(false);
    console.log(dateCreation);
    await createMagasin(
      label,
      dateCreation!.toDate(getLocalTimeZone()),
      commentaire,
    )
      .then(() => {
        toast.success("Nouveau magasin enregistré");
        setIsNewRowAdded(!isNewRowAdded);
        setShouldCloseModal(true);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            setRequestError(error.response.data);
          }
        }
        throw new Error("Une erreur c'est produite");
      });
  };

  const onRowDelete = async (id: number) => {
    setShouldCloseModal(false);
    await deleteMagasin(id).then((response) => {
      toast.success(response.message);
      setIsNewRowAdded(!isNewRowAdded);
      setShouldCloseModal(true);
    });
  };

  const onRowUpdate = async () => {
    await updateMagasin(
      rowToUpdate!,
      label,
      dateCreation!.toDate(getLocalTimeZone()),
      commentaire,
    )
      .then((response) => {
        toast.success(response.message);
        setIsNewRowAdded(!isNewRowAdded);
        setRowToUpdate(null);
        setLabel("");
        setCommentaire("");
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

  const resetInput = () => {
    setLabel("");
    setCommentaire("");
    setRowToUpdate(null);
    setRequestError(null);
  };

  const viewDetails = (id: number) => {
    navigate(`/referentiels/magasins?idMagasin=${id}`);
  };

  return (
    <CrudComponent
      isDeleteAuthorized
      isUpdateAuthorized
      addModalContent={
        <div className="w-full flex flex-col justify-center gap-4 align-center min-h-[170px] pb-5">
          <Input
            isClearable
            isRequired
            errorMessage={requestError?.magLiError}
            isInvalid={
              requestError?.magLiError !== null &&
              requestError?.magLiError !== undefined
            }
            label="Libellé"
            radius="sm"
            size="lg"
            type="text"
            validationBehavior="aria"
            value={label}
            onChange={(e) => onLabelChange(e)}
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
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Textarea
              label="Commentaire"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
            />
          </div>
        </div>
      }
      columns={columns}
      dataAbbreviation="mag"
      initialPage={page}
      pageIcon={<FontAwesomeIcon icon={faWarehouse} />}
      pageTitle="Magasin"
      pages={totalPage}
      resetInput={resetInput}
      rowsData={data as Record<string, any>[]}
      setRowToUpdate={setRowToUpdate}
      shouldCloseModal={shouldCloseModal}
      onAdd={createNewFamille}
      onPageChange={onPageChange}
      onRowClick={viewDetails}
      onRowDelete={onRowDelete}
      onRowUpdate={onRowUpdate}
      onSearch={() => {}}
    />
  );
};

export default function MagasinPage() {
  const location = useLocation(); // Get the location object
  const searchParams = new URLSearchParams(location.search);
  const idMagasin = searchParams.get("idMagasin")
    ? parseInt(searchParams.get("idMagasin")!)
    : null;

  // Use an effect to watch for changes in the URL
  useEffect(() => {
    // Any additional logic can go here if needed
  }, [location]); // Depend on location to trigger on URL change

  const RenderPage =
    idMagasin === null || idMagasin === undefined ? (
      <Index />
    ) : (
      <DetailsMagasin />
    );

  return RenderPage;
}
