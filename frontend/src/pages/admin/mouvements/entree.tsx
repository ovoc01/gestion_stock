import { Input } from "@nextui-org/input";
import { Autocomplete, AutocompleteItem, Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import CrudComponent from "@/components/features/crud-components";
import { getAllArticles } from "@/services/api/article.service";
import { getAllEmplacements } from "@/services/api/batiment.service";
import {
  createMouvementEntree,
  getAllEntrees,
} from "@/services/api/mouvement.service";
import { FetchType } from "@/shared/shared";
import { ArticleDataProps, EmplacementDataProps, RowData } from "@/types/types";

export default function MouvementEntree() {
  const [data, setData] = useState<RowData[] | null>([]);

  const [articles, setArticles] = useState<ArticleDataProps[] | null>([]);
  const [emplacements, setEmplacements] = useState<
    EmplacementDataProps[] | null
  >([]);

  const { page, size } = { page: 1, size: 5 };

  const [quantite, setQuantite] = useState<number | null>(null);
  const [prixUnitaire, setPrixUnitaire] = useState<number | null>(null);
  const [justif, setJustif] = useState<string | null>(null);

  const [pageNeedReload, setPageNeedReload] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [selectedEmplacement, setSelectedEmplacement] = useState<number | null>(
    null,
  );
  const [requestError, setRequestError] = useState<any>(null);

  useEffect(() => {
    getAllEntrees()
      .then((response) => {
        setData(response.mouvements);
      })
      .catch((error) => {
        console.log(error);
      });

    getAllArticles({ page, size, fetch: FetchType.ALL })
      .then((response) => {
        setArticles(response.articles);
      })
      .catch((error) => {
        console.log(error);
      });

    getAllEmplacements({ page, size, fetch: FetchType.ALL })
      .then((response) => {
        setEmplacements(response.emplacements);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [pageNeedReload]);

  const columns = [
    {
      key: "cmdeLigneId",
      label: "ID",
      sortable: true,
    },
    {
      key: "article",
      label: "Article",
      sortable: true,
    },
    {
      key: "code",
      label: "Code",
      sortable: true,
    },
    {
      key: "reference",
      label: "Reference",
      sortable: true,
    },
    {
      key: "emplacement",
      label: "Emplacement",
      sortable: true,
    },
    {
      key: "prixUnitaire",
      label: "Prix unitaire",
      sortable: true,
    },
    {
      key: "quantite",
      label: "Quantite",
      sortable: true,
    },
    {
      key: "unite",
      label: "Unite",
      sortable: true,
    },
    {
      key: "dateDeMouvement",
      label: "Date du mouvement",
      sortable: true,
    },
  ];

  const handleEntreeCreation = async () => {
    createMouvementEntree(
      quantite!,
      prixUnitaire!,
      selectedArticle!,
      selectedEmplacement!,
      justif!,
    )
      .then((response) => {
        setPageNeedReload(!pageNeedReload);
        toast.success("Nouvelle entrée enregistrer", response);
      })
      .catch((error) => {
        console.log(error);
        setRequestError(error.response.data);
      });
  };

  const resetInput = () => {
    setRequestError(null);
    setQuantite(null);
    setPrixUnitaire(null);
    setJustif(null);
  };

  const onArticleChange = (item: any) => {
    if (item) {
      setSelectedArticle(parseInt(item.toString()))
    }
  }

  const onEmplacementChange = (item: any) => {
    if (item) {
      setSelectedEmplacement(parseInt(item.toString()))
    }
  }

  return (
    <>
      <CrudComponent
        addModalContent={
          <div className="w-full flex flex-col gap-3 pb-8  p-8">
            <h1 className="text-3xl font-thin" />
            <h1 className="text-small text-default-400 ml-1">Emplacement</h1>
            <div className="flex gap-4">


              <Autocomplete
                defaultItems={emplacements!}
                label="Emplacement "
                placeholder="Rechercher "
                variant="bordered"
                size="sm"
                isInvalid={requestError?.emplacementError !== null && requestError?.fouremplacementErrornisseurError !== undefined}
                errorMessage={requestError?.emplacementError}
                listboxProps={{
                  emptyContent: 'Aucun emplacement trouvé',
                }}
                isClearable
                onSelectionChange={(item) => onEmplacementChange(item)}
                defaultSelectedKey={1}

              >
                {(item) => <AutocompleteItem key={item.emplId}>{item.emplLi}</AutocompleteItem>}
              </Autocomplete>
            </div>

            <Divider className="my-4" />
            <h1 className="text-small text-default-400 ml-1">
              Details du mouvements
            </h1>
            <div className="flex w-full gap-4">

              <Autocomplete
                defaultItems={articles!}
                label="Article "
                placeholder="Rechercher "
                variant="bordered"
                size="sm"
                isInvalid={
                  requestError?.articleError !== null &&
                  requestError?.articleError !== undefined
                }
                errorMessage={requestError?.articleError}
                listboxProps={{
                  emptyContent: 'Aucun Article trouvé',
                }}
                isClearable
                onSelectionChange={(item) => onArticleChange(item)}
                defaultSelectedKey={1}

              >
                {(item) => <AutocompleteItem key={item.artId}>{item.artLi}</AutocompleteItem>}
              </Autocomplete>
            </div>
            <div className="flex  gap-4">
              <Input
                errorMessage={requestError?.quantiteError}
                isInvalid={
                  requestError?.quantiteError !== null &&
                  requestError?.quantiteError !== undefined
                }
                label="Quantite"
                radius="sm"
                size="md"
                type="number"
                validationBehavior="aria"
                value={quantite ? quantite!.toString() : ""}
                variant="bordered"
                onChange={(e) => {
                  setQuantite(parseInt(e.target.value));
                }}
              />
              <Input
                errorMessage={requestError?.prixUnitaireError}
                isInvalid={
                  requestError?.prixUnitaireError !== null &&
                  requestError?.prixUnitaireError !== undefined
                }
                label="Prix unitaire"
                radius="sm"
                size="md"
                type="number"
                validationBehavior="aria"
                value={prixUnitaire ? prixUnitaire!.toString() : ""}
                variant="bordered"
                onChange={(e) => {
                  setPrixUnitaire(parseInt(e.target.value));
                }}
              />
            </div>
            <div className="flex w-full gap-4">

              <Input
                errorMessage={requestError?.justifError}
                isInvalid={
                  requestError?.justifError !== null &&
                  requestError?.justifError !== undefined
                }
                label="Bon de commande"
                radius="sm"
                size="md"
                type="text"
                validationBehavior="aria"
                value={justif!}
                variant="bordered"
                onChange={(e) => {
                  setJustif(e.target.value);
                }}
              />
            </div>
          </div>
        }
        columns={columns}
        dataAbbreviation="cmde"
        initialPage={page}
        pageTitle="Entrée de stock"
        resetInput={resetInput}
        rowsData={data as Record<string, any>[]}
        onAdd={handleEntreeCreation}
        onSearch={() => { }}
      />
    </>
  );
}
