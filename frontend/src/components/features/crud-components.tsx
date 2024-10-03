import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Button,
  Input,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  getKeyValue,
} from "@nextui-org/react";
import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { title } from "../primitives";

import { levenshteinDistance } from "@/utils/index";
import { exportArticle, exportPDF } from "@/services/api/export-data.service";
import { SearchIcon } from "@/components/ui/icons";
import "./crudComponents.css";
import { RowData } from "@/types/types";

interface Column {
  key: string;
  label: string;
  type?: string; // Vous pouvez ajouter d'autres propriétés de colonne si nécessaire
}

interface CrudComponentProps {
  setRowToUpdate?: (id: number) => void;
  pageIcon?: React.ReactNode;
  pageTitle?: string;
  dataAbbreviation?: string;
  columns: Column[];
  rowsData: RowData[];
  pages?: number;
  initialPage?: number;
  addModalContent?: React.ReactNode;
  errorMessage?: string;
  modalTitle?: string;
  isUpdateAuthorized?: boolean;
  isDeleteAuthorized?: boolean;
  isCustomActionAuthorized?: boolean;
  customAction?: React.ReactNode;
  onAdd?: () => void;
  onSearch?: (searchTerm: string) => void;
  onPageChange?: (page: number) => void;
  onRowDelete?: (id: number) => void;
  onRowUpdate?: () => void;
  resetInput?: () => void;
  updateIcon?: IconProp;
  deleteIcon?: IconProp;
  size?:
    | "2xl"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full"
    | undefined;
  extraComponent?: React.ReactNode;
  modalClassName?: string;
  onRowClick?: (id: number) => void;
  shouldCloseModal: boolean;
}

const ExportButton = () => {
  const onPressExcel = async () => {
    const response = await exportArticle();
    const blob = new Blob([response.data], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "articles.csv";
    a.click();
    document.body.appendChild(a);
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const onPressPDF = async () => {
    const response = await exportPDF();
    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);

    window.open(url, "_blank");
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className=" text-background px-4 py-2"
          color="secondary"
          endContent={<FontAwesomeIcon icon={faShare} />}
          size="lg"
        >
          Exporter
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="new" onPress={onPressPDF}>
          PDF
        </DropdownItem>
        <DropdownItem key="copy" onPress={onPressExcel}>
          Excel
        </DropdownItem>
        <DropdownItem key="edit">CSV</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const DeleteModal = ({
  isOpen,
  onOpenChange,
  liValue,
  idValue,
  onRowDelete,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  liValue: string | null;
  idValue: number | null;
  onRowDelete: (onClose: () => void, id: number) => void;
}) => {
  return (
    <Modal isOpen={isOpen} size="xl" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Supprimer</ModalHeader>
            <ModalBody>
              <p>
                Êtes-vous sûr de vouloir supprimer l'élément : <b>{liValue}</b>{" "}
                ?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                radius="sm"
                size="lg"
                variant="light"
                onPress={onClose}
              >
                Annuler
              </Button>
              <Button
                className="bg-foreground text-background"
                radius="sm"
                size="lg"
                onPress={() => {
                  // Supprimer l'élément
                  onRowDelete(onClose, idValue!);
                }}
              >
                Valider
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const CrudComponent: React.FC<CrudComponentProps> = ({
  columns,
  rowsData,
  pages = 1,
  initialPage = 1,
  addModalContent,
  errorMessage,
  pageTitle,
  pageIcon,
  isUpdateAuthorized,
  isCustomActionAuthorized,
  isDeleteAuthorized,
  customAction,
  dataAbbreviation,
  onAdd,
  onSearch,
  onPageChange,
  onRowDelete,
  onRowUpdate,
  setRowToUpdate,
  resetInput,
  updateIcon,
  deleteIcon,
  size,
  extraComponent,
  modalClassName,
  onRowClick,
  shouldCloseModal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [liValueToDelete, setLiValueToDelete] = useState<string | null>(null);
  const [idValueDelete, setIdValueToDelete] = useState<number | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onOpenChange: deleteOnOpenChange,
  } = useDisclosure();
  const [isUpdateBtnPressed, setIsUpdateBtnPressed] = useState(false);
  const columnWithAction = columns.concat({
    key: "action",
    label: "Actions",
  });

  type DataType = (typeof rowsData)[0];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch && onSearch(e.target.value);
  };

  const filteredRows = rowsData.filter((row) => {
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase()),
    );
  });

  const getNeededKey = (data: DataType) => {
    let labelKey = null;
    let idKey = null;

    let closestLiDistance = Infinity;
    let closestIdDistance = Infinity;

    for (const key in data) {
      const keyLower = key.toLowerCase();
      const titleLi = (dataAbbreviation + "Li").toLowerCase();
      const titleId = (dataAbbreviation + "Id").toLowerCase();
      const liDistance = levenshteinDistance(titleLi, keyLower);
      const idDistance = levenshteinDistance(titleId, keyLower);

      if (liDistance < closestLiDistance) {
        closestLiDistance = liDistance;
        labelKey = key;
      }
      if (idDistance < closestIdDistance) {
        closestIdDistance = idDistance;
        idKey = key;
      }
    }

    return { labelKey, idKey };
  };

  const renderCell = useCallback((data: DataType, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof DataType];

    const { labelKey, idKey } = getNeededKey(data);
    let liValue = data[labelKey!];
    let idValue = data[idKey!];

    switch (columnKey) {
      case "action":
        return (
          <div className="relative flex justify-start items-center ">
            {isUpdateAuthorized && (
              <Button
                color="secondary"
                variant="light"
                onPress={() => {
                  setRowToUpdate!(idValue!);
                  setIsUpdateBtnPressed(true);
                  onOpen();
                  console.log("update", idValue);
                }}
              >
                <FontAwesomeIcon
                  fontSize={16}
                  icon={!updateIcon ? faPenToSquare : updateIcon!}
                />
              </Button>
            )}
            {isDeleteAuthorized && (
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  setLiValueToDelete(liValue);
                  setIdValueToDelete(idValue);
                  deleteOnOpen();
                }}
              >
                <FontAwesomeIcon
                  fontSize={16}
                  icon={!deleteIcon ? faTrash : deleteIcon!}
                />
              </Button>
            )}

            {isCustomActionAuthorized && customAction}
          </div>
        );
      default:
        if (columnKey.toString().toLowerCase().includes("etat")) {
          return (
            <Button
              className="uppercase"
              color={cellValue === 5 ? "danger" : "success"}
              size="sm"
              variant="bordered"
            >
              {cellValue !== 5 ? "en cours" : "cloturée"}
            </Button>
          );
        }

        return cellValue;
    }
  }, []);

  const onModalPressed = async (onClose: () => void) => {
    try {
      if (isUpdateBtnPressed) {
        await onRowUpdate!();
        setIsUpdateBtnPressed(false);
      } else {
        await onAdd!();
      }
      onClose();
    } catch (error) {}
  };

  const onDeleteModalDispose = (onClose: () => void, id: number) => {
    onRowDelete!(id);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <>
      <Modal
        className={[modalClassName, "min-w-80 z-40"].join(" ")}
        isOpen={isOpen}
        size={size ? size : "2xl"}
        onOpenChange={() => {
          onOpenChange();
          resetInput!();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col justify-center items-center gap-1 text-2xl">
                Ajouter {pageTitle}
              </ModalHeader>
              <ModalBody className="flex flex-col">{addModalContent}</ModalBody>
              <h2 className="text-danger flex flex-col gap-1 ml-8">
                {errorMessage}
              </h2>
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
                  onPress={() => {
                    onModalPressed(onClose);
                  }}
                >
                  Valider
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <DeleteModal
        idValue={idValueDelete}
        isOpen={deleteIsOpen}
        liValue={liValueToDelete}
        onOpenChange={deleteOnOpenChange}
        onRowDelete={onDeleteModalDispose}
      />

      <div className="flex flex-col gap-6">
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-lg text-center justify-center">
            <h1
              className={title()}
              style={{
                textTransform: "capitalize",
              }}
            >
              {pageIcon} {pageTitle}
            </h1>
          </div>
        </section>
        <div className="z-0 hover:z-50">{extraComponent}</div>
        <Table
          aria-label="Tableau"
          bottomContent={
            pages > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="default"
                  page={initialPage}
                  total={pages}
                  onChange={(page) => onPageChange!(page)}
                />
              </div>
            ) : null
          }
          className="w-full"
          topContent={
            <div className="flex flex-col gap-4">
              <div className="flex justify-between gap-3 items-end">
                <Input
                  isClearable
                  classNames={{
                    base: "w-full sm:max-w-[44%]",
                    inputWrapper: "border-1",
                  }}
                  placeholder="Rechercher..."
                  size="lg"
                  startContent={<SearchIcon className="text-default-300" />}
                  value={searchTerm}
                  variant="bordered"
                  onChange={handleSearch}
                  onClear={() => setSearchTerm("")}
                />
                <div className="flex gap-3">
                  <ExportButton />

                  <Button
                    className="bg-foreground text-background px-4 py-2"
                    color="default"
                    endContent={<FontAwesomeIcon icon={faPlus} />}
                    size="lg"
                    variant="flat"
                    onPress={onOpen}
                  >
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>
          }
          topContentPlacement="outside"
        >
          <TableHeader
            columns={
              isDeleteAuthorized ||
              isCustomActionAuthorized ||
              isUpdateAuthorized
                ? columnWithAction
                : columns
            }
          >
            {(column) => (
              <TableColumn key={column.key}>
                <h1 className="text-lg">{column.label}</h1>
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"Pas d'élément à afficher"}
            items={filteredRows}
          >
            {(item) => (
              <TableRow key={item[columns[0].key]}>
                {(columnKey) => (
                  <TableCell
                    className={[
                      "text-lg",
                      onRowClick === undefined ? "" : "cursor-pointer",
                    ].join(" ")}
                    onClick={() => {
                      const id = getKeyValue(item, columns[0].key);

                      onRowClick!(id);
                    }}
                  >
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default CrudComponent;
