import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "@nextui-org/input";
import { Divider, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { downloadFile } from "@/utils/download";
import {
  ArticleDataProps,
  ServiceExploitantDataProps,
  SousFamilleDataProps,
  UniteDataProps,
} from "@/types/types";
import { getAllServiceExploitant } from "@/services/api/service-exploitant.service";
import {
  createArticle,
  deleteArticle,
  exportArticleExcel,
  getAllArticles,
  getAllSousFamilles,
  getAllUnite,
  updateArticle,
} from "@/services/api/article.service";
import { DownloadType } from "@/config/site.enum";
import CrudComponent from "@/components/features/crud-components";
export default function ArticlePage() {
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;
  const size = searchParams.get("size")
    ? parseInt(searchParams.get("size")!)
    : 5;
  const [isNewRowAdded, setIsNewRowAdded] = useState(false);
  const [sousFamId, setSousFamId] = useState<number | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [uniteId, setUniteId] = useState<number | null>(null);
  const [rowToUpdate, setRowToUpdate] = useState<number | null>(null);
  const navigate = useNavigate();

  const [label, setLabel] = useState("");
  const [artRef, setArtRef] = useState("");

  const [sousFamilles, setSousFamilles] = useState<
    SousFamilleDataProps[] | null
  >([]);
  const [serviceExploitants, setServiceExploitants] = useState<
    ServiceExploitantDataProps[] | null
  >([]);
  const [unites, setUnites] = useState<UniteDataProps[] | null>([]);
  const [data, setData] = useState<ArticleDataProps[] | null>([]);

  const [requestError, setRequestError] = useState<any>(null);
  const [totalPage, setTotalPage] = useState<number>();

  useEffect(() => {
    getAllArticles({ page, size }).then((response) => {
      setData(response.articles);
      const realPage = Math.ceil(response.totalPages / size);

      setTotalPage(realPage);
    });
  }, [isNewRowAdded, page, size]);

  useEffect(() => {
    getAllSousFamilles({ page, size }).then((response) => {
      setSousFamilles(response.sousFamilles);
    });

    getAllServiceExploitant({ page, size }).then((response) => {
      setServiceExploitants(response.serviceExploitants);
    });

    getAllUnite({ page, size })
      .then((response) => {
        setUnites(response.unites);
      })
      .catch((error) => {
        toast.error("Erreur lors de la récupération des données ", error);
      });
  }, []);

  useEffect(() => {
    if (rowToUpdate) {
      const row = data!.find(
        (row: ArticleDataProps) => row.artId === rowToUpdate,
      );

      console.log(row);
      if (row) {
        setLabel(row.artLi.trim());
        setArtRef(row.artRef?.trim());
        setSousFamId(row.sousFamId);
        setServiceId(row.serviceId);
        setUniteId(row.uniteId);
      }
    }
  }, [rowToUpdate]);

  const columns = [
    {
      key: "artId",
      label: "Article Id",
      type: "integer",
    },
    {
      key: "artRef",
      label: "Reference",
      type: "string",
    },
    {
      key: "artCd",
      label: "Code",
    },
    {
      key: "artLi",
      label: "Libellé",
      type: "string",
    },
    {
      key: "sousFamLi",
      label: "Sous Famille",
    },
  ];

  const resetInput = () => {
    setSousFamId(null);
    setServiceId(null);
    setUniteId(null);
    setLabel("");
    setArtRef("");
    setRowToUpdate(null);
    setRequestError(null);
  };

  const onAdd = async () => {
    await createArticle(artRef, label, sousFamId!, serviceId!, uniteId!)
      .then(() => {
        setIsNewRowAdded(!isNewRowAdded);
        toast.success("Article ajouté avec succès");
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            setRequestError(error.response.data);
          }
        }
        throw new Error("Vody");
      });
  };

  const onRowDelete = async (id: number) => {
    await deleteArticle(id).then((response) => {
      console.log(response);
      setIsNewRowAdded(!isNewRowAdded);
      toast.success("Article supprimé avec succès");
    });
  };

  const onPageChange = (page: number) => {
    searchParams.set("page", page.toString());
    searchParams.set("size", size.toString());
    const updatedUrl = `${location.pathname}?${searchParams.toString()}`;

    navigate(updatedUrl);
  };

  const onRowUpdate = async () => {
    await updateArticle(
      rowToUpdate!,
      artRef,
      label,
      sousFamId!,
      serviceId!,
      uniteId!,
    )
      .then((response) => {
        console.log(response);
        setIsNewRowAdded(!isNewRowAdded);
        toast.success("Article modifié avec succès");
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            setRequestError(error.response.data);
          }
        }
      });
  };

  const exportExcel = async () => {
    const response = await exportArticleExcel();

    console.log(response);
    await downloadFile(response, DownloadType.EXCEL);
  };

  return (
    <CrudComponent
      isDeleteAuthorized
      isUpdateAuthorized
      addModalContent={
        <div className="w-full flex flex-col gap-4 pb-5">
          <h1 className="text-small text-default-400 ml-1">
            Service exploitant
          </h1>
          <Select
            errorMessage={requestError?.serviceIdError}
            isInvalid={
              requestError?.serviceIdError !== null &&
              requestError?.serviceIdError !== undefined
            }
            label="Services exploitants"
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
          <Divider className="my-2" />
          <h1 className="text-small text-default-400 ml-1">
            Information du nouvelle article
          </h1>
          <div className="flex gap-4">
            <Input
              errorMessage={requestError?.artLiError}
              isInvalid={
                requestError?.artLiError !== null &&
                requestError?.artLiError !== undefined
              }
              label="Libellé"
              radius="sm"
              size="md"
              type="text"
              validationBehavior="aria"
              value={label}
              variant="bordered"
              onChange={(e) => setLabel(e.target.value)}
            />
            <Select
              errorMessage={requestError?.uniteIdError}
              isInvalid={
                requestError?.uniteIdError !== null &&
                requestError?.uniteIdError !== undefined
              }
              label="Unites"
              selectedKeys={uniteId ? [uniteId.toString()] : []}
              variant="bordered"
              onChange={(e) => {
                setUniteId(parseInt(e.target.value));
              }}
            >
              {unites!.map((unite) => (
                <SelectItem key={unite.uniteId} value={unite.uniteId}>
                  {unite.uniteLi}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Select
            errorMessage={requestError?.sousFamIdError}
            isInvalid={
              requestError?.sousFamIdError !== null &&
              requestError?.sousFamIdError !== undefined
            }
            label="Sous Familles"
            selectedKeys={sousFamId ? [sousFamId.toString()] : []}
            variant="bordered"
            onChange={(e) => {
              setSousFamId(parseInt(e.target.value));
            }}
          >
            {sousFamilles!.map((sousFam) => (
              <SelectItem key={sousFam.sousFamId} value={sousFam.sousFamId}>
                {sousFam.sousFamLi}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Reference"
            radius="sm"
            size="md"
            type="text"
            validationBehavior="aria"
            value={artRef}
            onChange={(e) => setArtRef(e.target.value)}
          />
        </div>
      }
      columns={columns}
      dataAbbreviation="art"
      exportExcel={exportExcel}
      pageIcon={<FontAwesomeIcon icon={faNewspaper} />}
      pageTitle="Article"
      pages={totalPage}
      resetInput={resetInput}
      rowsData={data as Record<string, any>[]}
      setRowToUpdate={setRowToUpdate}
      onAdd={onAdd}
      onPageChange={onPageChange}
      onRowDelete={onRowDelete}
      onRowUpdate={onRowUpdate}
      onSearch={() => {}}
    />
  );
}
