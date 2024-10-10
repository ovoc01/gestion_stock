import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/button";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import ReadOnlyTable from "@/components/ui/table/read-only";
import { DownloadType } from "@/config/site.enum";
import {
  getAllEmplacements,
  getAllMagasins,
} from "@/services/api/batiment.service";
import {
  exportValorisationStock,
  exportValorisationStockPDF,
  getValorisationStock,
} from "@/services/api/stock.service";
import {
  EmplacementDataProps,
  MagasinDataProps,
  ValorisationDetails,
} from "@/types/types";
import { downloadFile } from "@/utils/download";
import { formatCurrency } from "@/utils/formatter";

export default function ValorisationStock() {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse URL parameters
  const searchParams = new URLSearchParams(location.search);
  const initialEmplId = searchParams.get("emplId")
    ? parseInt(searchParams.get("emplId")!)
    : null;
  const initialMagId = searchParams.get("magId")
    ? parseInt(searchParams.get("magId")!)
    : null;
  const initialCodeArticle = searchParams.get("codeArticle")
    ? searchParams.get("codeArticle")
    : null;

  // State to store the fetched data
  const [magasins, setMagasins] = useState<MagasinDataProps[] | null>([]);
  const [emplacements, setEmplacements] = useState<
    EmplacementDataProps[] | null
  >([]);
  const [valorisationStock, setValorisationStock] = useState<number | null>(
    null,
  );
  const [valorisationDetails, setValorisationDetails] = useState<
    ValorisationDetails[] | null
  >(null);

  // Fetch magasins and emplacements on component mount
  useEffect(() => {
    getAllMagasins({ page: 1, size: 5 })
      .then((response) => {
        setMagasins(response.magasins);
      })
      .catch((err) => {
        console.log(err);
      });

    getAllEmplacements({ page: 1, size: 5 })
      .then((response) => {
        setEmplacements(response.emplacements);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Automatically perform search if URL parameters exist
  useEffect(() => {
    if (initialMagId || initialEmplId || initialCodeArticle) {
      handleSearch();
    }
  }, [initialMagId, initialEmplId, initialCodeArticle]);

  const handleSearch = () => {
    //if (!initialMagId && !initialEmplId && !initialCodeArticle) return
    //const updatedParams = handleFilterChange(initialEmplId!, initialMagId!, initialCodeArticle!);
    //console.log(updatedParams.toString())
    //navigate(`${location.pathname}?${updatedParams.toString()}`);

    getValorisationStock(initialMagId!, initialEmplId!, initialCodeArticle!)
      .then((response) => {
        setValorisationStock(response.valorisation);
        setValorisationDetails(response.details);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFilterChange = (
    newEmplId?: number,
    newMagId?: number,
    newCodeArticle?: string,
  ) => {
    const params = new URLSearchParams(location.search);
    const searchParams = new URLSearchParams(location.search);

    // Get the initial values from search params if new values are undefined
    const initialEmplId = searchParams.get("emplId")
      ? parseInt(searchParams.get("emplId")!)
      : null;
    const initialMagId = searchParams.get("magId")
      ? parseInt(searchParams.get("magId")!)
      : null;
    const initialCodeArticle = searchParams.get("codeArticle")
      ? searchParams.get("codeArticle")
      : null;

    // Helper function to update or delete query params
    const updateQueryParam = (
      key: string,
      newValue?: any,
      initialValue?: any,
    ) => {
      const value = newValue !== undefined ? newValue : initialValue; // Use newValue if provided, otherwise fallback to initialValue

      if (typeof value === "string" && value.trim() !== "") {
        params.set(key, value.trim());
      } else if (typeof value === "number" && !isNaN(value)) {
        params.set(key, String(value));
      } else {
        params.delete(key); // Remove from params if value is undefined or invalid
      }
    };

    // Update relevant query parameters, using the initial values if new values are undefined
    updateQueryParam("magId", newMagId, initialMagId);
    updateQueryParam("emplId", newEmplId, initialEmplId);
    updateQueryParam("codeArticle", newCodeArticle, initialCodeArticle);

    navigate(`${location.pathname}?${params.toString()}`);

    return params; // Return the updated parameters
  };

  const headers = [
    {
      key: "code_article",
      label: "Reference",
    },
    {
      key: "article",
      label: "Article",
    },
    {
      key: "sous_famille",
      label: "Famille",
    },
    {
      key: "magasin",
      label: "Magasin",
    },
    {
      key: "emplacement",
      label: "Emplacement",
    },
    {
      key: "quantite",
      label: "Quantité",
    },
    {
      key: "cmup",
      label: "CMUP",
    },
  ];

  const exportExcel = async () => {
    const response = await exportValorisationStock(
      initialMagId!,
      initialEmplId!,
      initialCodeArticle!,
    );

    await downloadFile(response, DownloadType.EXCEL);
  };

  const exportPDF = async () => {
    const response = await exportValorisationStockPDF(
      initialMagId!,
      initialEmplId!,
      initialCodeArticle!,
    );

    await downloadFile(response, DownloadType.PDF);
  };

  /*   const resetInput = () => {
       navigate(`/stocks`)
    } */

  return (
    <div className="w-full flex   flex-col item-center justify-between gap-11 h-full">
      <h1 className="text-6xl font-bold text-primary text-center">
        Valorisations de Stock
      </h1>
      <div className="w-full flex h-full justify-around">
        <div className="w-4/6">
          {valorisationDetails ? (
            <>
              <ReadOnlyTable data={valorisationDetails!} headers={headers} />
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-medium mt-5">
                  Valorisations:{" "}
                  <span className="text-primary font-semibold">
                    {formatCurrency(valorisationStock!)}
                  </span>
                </h1>
              </div>
              <div className="flex w-1/5 gap-5 mt-4">
                <Button
                  className=" bg-lime-400 text-light rounded-md"
                  onPress={exportExcel}
                >
                  EXCEL
                </Button>
                <Button
                  className="bg-primary text-light rounded-md"
                  onPress={exportPDF}
                >
                  PDF
                </Button>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="w-2/6 max-w-[300px] max-h-[350px] flex  flex-col gap-3 pb-8 border-solid border-1  border-gray-300 rounded-lg shadow-md p-8  mt-8 sticky">
          <h1 className="text-3xl font-thin flex items-center justify-center w-full gap-8">
            Filtre
            {/*   <Button size="sm" onPress={resetInput}>
                           Effacer
                     </Button> */}
          </h1>

          <h1 className="text-small text-default-400 ml-1">Magasin</h1>
          <div className="flex w-full gap-4">
            <Select
              label="Magasin"
              selectedKeys={initialMagId ? [initialMagId.toString()] : []}
              size="sm"
              variant="bordered"
              onChange={(e) => {
                handleFilterChange(
                  undefined,
                  parseInt(e.target.value),
                  undefined,
                );
              }}
            >
              {magasins!.map((mag) => (
                <SelectItem key={mag.magId} value={mag.magId}>
                  {mag.magLi}
                </SelectItem>
              ))}
            </Select>
          </div>

          <h1 className="text-small text-default-400 ml-1">Emplacement</h1>
          <div className="flex w-full gap-4">
            <Select
              label="Emplacement"
              selectedKeys={initialEmplId ? [initialEmplId.toString()] : []}
              size="sm"
              variant="bordered"
              onChange={(e) => {
                handleFilterChange(
                  parseInt(e.target.value),
                  undefined,
                  undefined,
                );
              }}
            >
              {emplacements!.map((emp) => (
                <SelectItem key={emp.emplId} value={emp.emplId}>
                  {emp.emplLi}
                </SelectItem>
              ))}
            </Select>
          </div>

          <h1 className="text-small text-default-400 ml-1">Code Article</h1>
          <div className="flex w-full gap-4">
            <Input
              isClearable
              label="Code Article"
              radius="sm"
              size="sm"
              type="text"
              validationBehavior="aria"
              value={initialCodeArticle || ""}
              variant="bordered"
              onChange={(e) =>
                handleFilterChange(undefined, undefined, e.target.value)
              }
              onClear={() => handleFilterChange(undefined, undefined, "")}
            />
          </div>

          <div className="w-3/6 p-4 ">
            <Button
              color="primary"
              size="lg"
              startContent={<FontAwesomeIcon icon={faSearch} />}
              variant="shadow"
              onPress={handleSearch}
            >
              Rechercher
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
