import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Autocomplete, AutocompleteItem, Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { formatCurrency } from "@/utils/formatter";
import {
  ArticleDataProps,
  CommandeDetails,
  MagasinDetails,
} from "@/types/types";
import {
  createMouvementSortie,
  genererCession,
  getAllSortiesByIdCommande,
} from "@/services/api/mouvement.service";
import { getAllArticles } from "@/services/api/article.service";
import { downloadFile } from "@/utils/download";
import { DownloadType } from "@/config/site.enum";
import { FetchType } from "@/shared/shared";

export default function DetailsCommande() {
  const { isOpen, onOpenChange } = useDisclosure();
  const searchParams = new URLSearchParams(location.search);
  const idCommande = searchParams.get("idCommande")
    ? parseInt(searchParams.get("idCommande")!)
    : null;
  const [magasin] = useState<MagasinDetails | null>(null);
  const [details, setDetails] = useState<CommandeDetails | null>();
  const [requestError, setRequestError] = useState<any>("");

  const [quantite, setQuantite] = useState<number | null>(null);

  const [pageNeedReload, setPageNeedReload] = useState(false);

  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [articles, setArticles] = useState<ArticleDataProps[] | null>([]);

  const { page, size } = { page: 1, size: 5 };

  useEffect(() => {
    getAllSortiesByIdCommande(idCommande!)
      .then((response) => {
        setDetails(response.commande);
      })
      .catch((err) => {
        console.log(err);
      });

    getAllArticles({ page, size, fetch: FetchType.ALL })
      .then((response) => {
        setArticles(response.articles);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [idCommande, pageNeedReload]);

  const addMouvementSortie = () => {
    createMouvementSortie(quantite!, selectedArticle!, idCommande!)
      .then((response) => {
        setPageNeedReload(!pageNeedReload);
        toast.success("Sortie enregistré", response);
      })
      .catch((error) => {
        console.log(error);
        //toast.error('Erreur lors de l\'enregistrement de la sortie',error)
        setRequestError(error.response.data);
      });
  };

  const pdfExport = async () => {
    const response = await genererCession(idCommande!)
    await downloadFile(response, DownloadType.PDF)
  }

  const onArticleChange = (item: any) => {
    if (item) {
      setSelectedArticle(parseInt(item.toString()))
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} size="xl" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <h1 className="text-3xl font-thin" />
                <h1 className="text-small text-default-400 ml-1">Commande</h1>

                <div className="flex gap-4">
                  <Input
                    isDisabled
                    label="De"
                    radius="sm"
                    size="md"
                    type="text"
                    validationBehavior="aria"
                    value={details?.info.emplacement}
                    variant="bordered"
                    onChange={() => { }}
                  />
                  <Input
                    isDisabled
                    label="Vers"
                    radius="sm"
                    size="md"
                    type="text"
                    validationBehavior="aria"
                    value={details?.info.uniteOperationnel}
                    variant="bordered"
                  />
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
                    size="md"
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
                </div>
                <h1 className="text-xs text-default-400 ml-1">Justif</h1>
                <div className="flex w-full gap-4">
                  <Input
                    errorMessage={requestError?.referenceError}
                    isInvalid={
                      requestError?.referenceError !== null &&
                      requestError?.referenceError !== undefined
                    }
                    label=""
                    radius="sm"
                    size="md"
                    type="text"
                    validationBehavior="aria"
                    variant="bordered"
                    onChange={() => { }}
                  />
                </div>
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
                  onPress={addMouvementSortie}
                >
                  Valider
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="w-full flex  h-fit items-center justify-center gap-8 py-8">
        <div className="w-4/5 h-full pb-8 border-solid border-1  border-gray-300 rounded-lg shadow-md p-8">
          <div className="about flex flex-col gap-4 ">
            <div className="flex justify-between items-center">
              <h1 className="text-5xl font-bold ">CMDE-1230</h1>
              <Button
                className=" rounded-md bg-primary text-white"
                size="lg"
                onPress={onOpenChange}
              >
                Nouvelle ligne
              </Button>
              <h1 className="text-xl flex flex-col text-center">
                Montant Total:
                <span className="text-3xl text-secondary italic font-semibold">
                  {details?.montantTotal}
                </span>
              </h1>
            </div>
            <h1 className="text-3xl font-light text-gray-500 mt-4">À propos</h1>
            <h1 className="text-md text-primary">
              {" "}
              Création:
              <span className="text-black ml-2">
                {details?.info.lib_commande}
              </span>
              <span className="text-black ml-2"> par Tendry Rakoto</span>
            </h1>
            <h1 className="text-md  flex justify-between">
              <span className="text-black">
                <span className="text-primary">DE:</span>{" "}
                {details?.info.emplacement}
              </span>
              <span className="text-primary">
                À:
                <span className="text-black ml-2">
                  {details?.info.uniteOperationnel}
                </span>
              </span>
            </h1>
            <h1 className="text-md text-primary">
              {" "}
              Téléphone:
              <span className="text-black ml-2">{magasin?.info.telephone}</span>
            </h1>
            <h1 className="text-md text-primary">
              Responsable:
              <span className="text-black ml-2">Voary Rakotoarison</span>
            </h1>
          </div>

          <div className=" mt-5 flex flex-col  ">
            <h1 className="text-lg font-light text-gray-500">
              Details du commandes
            </h1>
            <table className=" mt-4 table-auto ">
              <thead>
                <tr className="text-gray-500 border-b border-gray-500">
                  <th className="font-light text-start">Article</th>
                  <th className="font-light text-start">Code Article</th>
                  <th className="font-light text-center">Quantité</th>
                  <th className="font-light text-center">CMUP</th>
                  <th className="font-light text-center">Prix Total</th>
                </tr>
              </thead>
              <tbody className="">
                {details?.details.map((dts) => (
                  <tr


                    className="text-gray-500 border-b border-gray-300"
                  >
                    <td className="font-light text-start ">{dts.article}</td>
                    <td className="font-light text-start ">{dts.code}</td>
                    <td className="font-light text-center">{dts.quantite}</td>
                    <td className=" text-center text-primary italic">
                      {formatCurrency(dts.prixUnitaire)}
                    </td>
                    <td className="font-bold text-lg text-center text-primary">
                      {formatCurrency(dts.prixUnitaire * dts.quantite)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className=" mt-5 flex flex-col gap-2">
            <h6 className="text-sm italic ">
              Nb: * Les montants affichés sont des montants estimatifs et
              peuvent varier en fonction des mouvements de stock et ils sont
              tirés du periodes actuels.
            </h6>
          </div>
          <div className=" mt-5 flex flex-col gap-2">
            <Button className="w-40 bg-black text-white" size="lg" onPress={pdfExport}>
              Génerer cession
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
