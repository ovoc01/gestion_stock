import {
  Button,
  getKeyValue,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
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
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import DetailsCommande from "./details-commande";

import { getAllEmplacements } from "@/services/api/batiment.service";
import { getAllUniteOperationnel } from "@/services/api/unite-operationnel.service";
import {
  ArticleDataProps,
  CommandeData,
  EmplacementDataProps,
  RowData,
  UniteOperationnelDataProps,
} from "@/types/types";
import {
  createCommande,
  getAllCommandes,
  getAllSorties,
} from "@/services/api/mouvement.service";
import { getAllArticles } from "@/services/api/article.service";
import { FetchType } from "@/shared/shared";

function Index() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState<RowData[] | null>([]);
  const navigate = useNavigate();

  const [articles, setArticles] = useState<ArticleDataProps[] | null>([]);
  const [commandes, setCommandes] = useState<CommandeData[] | null>([]);

  const { page, size } = { page: 1, size: 5 };

  //const [quantite, setQuantite] = useState<number | null>(null)
  const [requestError, setRequestError] = useState<any>(null);

  const [pageNeedReload, setPageNeedReload] = useState(false);

  //const [selectedArticle, setSelectedArticle] = useState<number | null>(null)
  //const [selectedCommande, setSelectedCommande] = useState<number | null>(null)
  //const [emplacementDe, setEmplacementDe] = useState<string | null>(null)
  //const [unopA, setUnopA] = useState<string | null>(null)
  const [emplacements, setEmplacements] = useState<
    EmplacementDataProps[] | null
  >([]);
  const [unOp, setUnOp] = useState<UniteOperationnelDataProps[] | null>([]);

  useEffect(() => {
    getAllSorties()
      .then((response) => {
        setData(response.mouvements);
        data;
      })
      .catch((error) => {
        console.log(error);
      });

    getAllArticles({ page, size, fetch: FetchType.ALL })
      .then((response) => {
        setArticles(response.articles);
        articles;
      })
      .catch((error) => {
        console.log(error);
      });

    getAllCommandes()
      .then((response) => {
        setCommandes(response.commandes);
      })
      .catch((error) => {
        console.log(error);
      });

    getAllUniteOperationnel({ page, size, fetch: FetchType.ALL })
      .then((response) => {
        setUnOp(response.uniteOperationnels);
      })
      .catch((error) => {
        toast.error("Erreur lors de la récupération des données ", error);
      });

    getAllEmplacements({ page, size, fetch: FetchType.ALL })
      .then((response) => {
        setEmplacements(response.emplacements);
      })
      .catch((error) => {
        toast.error("Erreur lors de la récupération des données ", error);
      });
  }, [pageNeedReload]);

  const columns = [
    {
      key: "cmdeId",
      label: "ID",
      sortable: true,
    },
    {
      key: "emplacement",
      label: "De",
      sortable: true,
    },
    {
      key: "uniteOperationnel",
      label: "Vers",
      sortable: true,
    },
    {
      key: "lib_commande",
      label: "Libellé commande",
      sortable: true,
    },
  ];

  const [emplId, setEmplId] = useState<number | null>(null);
  const [unopId, setUnopId] = useState<number | null>(null);

  const resetInput = () => {
    setEmplId(null);
    setUnopId(null);
  };

  const createNewCommande = () => {
    createCommande(emplId!, unopId!)
      .then((response) => {
        toast.success("Nouvelle commande enregistrer", response);
        setPageNeedReload(!pageNeedReload);
      })
      .catch((error) => {
        setRequestError(error.response.data.error);
      });
  };

  return (
    <>
      <div className="w-full flex flex-col gap-5 pt-5 justify-center items-center">
        <Modal isOpen={isOpen} size="xl" onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <h1 className="text-3xl font-thin">
                    Création nouvelle commande
                  </h1>
                  <h1 className="text-small text-default-400 ml-1">
                    Unité operationnel concernés
                  </h1>
                  <div className="flex gap-4">
                    <Select
                      label="De"
                      selectedKeys={emplId ? emplId.toString() : []}
                      size="sm"
                      variant="bordered"
                      onSelectionChange={(value) => {
                        console.log(value);
                        const selectedValue = Array.from(value)[0];

                        setEmplId(
                          selectedValue ? parseInt(selectedValue) : null,
                        );
                      }}
                    >
                      {emplacements!.map((u) => (
                        <SelectItem key={u.emplId} value={u.emplId}>
                          {u.emplLi}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      key="test"
                      label="A"
                      selectedKeys={unopId ? unopId.toString() : []}
                      size="sm"
                      variant="bordered"
                      onSelectionChange={(value) => {
                        console.log(value);
                        const selectedValue = Array.from(value)[0];

                        setUnopId(
                          selectedValue ? parseInt(selectedValue) : null,
                        );
                      }}
                    >
                      {unOp!.map((u) => (
                        <SelectItem key={u.unopId} value={u.unopId}>
                          {u.unopLi}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <h1 className="text-sm " color="danger">
                    {requestError}
                  </h1>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    radius="sm"
                    size="lg"
                    variant="light"
                    onPress={() => {
                      onClose();
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    className="bg-foreground text-background"
                    radius="sm"
                    size="lg"
                    onPress={createNewCommande}
                  >
                    Valider
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <h1 className="text-4xl text-primary font-semibold">
          Liste des commandes
        </h1>
        <div className="w-4/5">
          <Table
            aria-label="Example static collection table"
            className="pt-5 "
            topContent={
              <Button
                className="bg-foreground text-background px-4 py-2 w-1/5"
                color="default"
                endContent={<FontAwesomeIcon icon={faPlus} />}
                size="lg"
                variant="flat"
                onPress={onOpen}
              >
                Ajouter
              </Button>
            }
            topContentPlacement="outside"
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>
                  {column.label.toLocaleUpperCase()}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              emptyContent={"Aucune sortie"}
              items={commandes! as Record<string, any>[]}
            >
              {(item) => (
                <TableRow
                  key={item[columns[0].key]}
                  className="hover:cursor-pointer hover:bg-primary-50"
                  onClick={() => {
                    navigate(
                      `/mouvements/commandes?idCommande=${item[columns[0].key]}`,
                    );
                  }}
                >
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

export default function Commande() {
  const location = useLocation(); // Get the location object
  const searchParams = new URLSearchParams(location.search);
  const idMagasin = searchParams.get("idCommande")
    ? parseInt(searchParams.get("idCommande")!)
    : null;

  // Use an effect to watch for changes in the URL
  useEffect(() => {
    // Any additional logic can go here if needed
  }, [location]); // Depend on location to trigger on URL change

  return idMagasin === null || idMagasin === undefined ? (
    <Index />
  ) : (
    <DetailsCommande />
  );
}
