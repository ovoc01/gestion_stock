import axios from "axios";

import { BASE_URL, PaginationProps, requestHeaders } from "../../shared/shared";

export const getAllPeriodes = async ({ page, size }: PaginationProps) => {
  //console.log(size,page)
  const response = await axios.get(
    BASE_URL + "mouvements/periodes?page=" + page + "&size=" + size,
    {
      headers: requestHeaders,
    },
  );

  return response.data;
};

export const createPeriode = async (label: string, dateDebut: Date) => {
  const response = await axios.post(
    BASE_URL + "mouvements/periodes",
    {
      periodeLi: label,
      periodeDtDb: dateDebut,
    },
    {
      headers: requestHeaders,
    },
  );

  return response.data;
};

export const updatePeriode = async (
  periodeId: number,
  periodeLi: string,
  dateCreation: Date,
  dateFin: Date,
) => {
  const response = await axios.put(
    BASE_URL + "mouvements/periodes/" + periodeId,
    {
      periodeId: periodeId,
      periodeLi: periodeLi,
      periodeDtDb: dateCreation,
      periodeDtFin: dateFin,
    },
    {
      headers: requestHeaders,
    },
  );

  return response.data;
};

export const getAllCommandes = async () => {
  const response = await axios.get(BASE_URL + "mouvements/commandes", {
    headers: requestHeaders,
  });

  return response.data;
};

export const createCommande = async (emplId: number, unopId: number) => {
  const response = await axios.post(
    BASE_URL + "mouvements/commandes",
    {
      emplId: emplId,
      unopId: unopId,
    },
    {
      headers: requestHeaders,
    },
  );

  return response.data;
};

export const getAllSorties = async () => {
  const response = await axios.get(BASE_URL + "mouvements/sorties", {
    headers: requestHeaders,
  });

  return response.data;
};

export const createMouvementSortie = async (
  quantite: number,
  artId: number,
  cmdeId: number,
) => {
  const response = await axios.post(
    BASE_URL + "mouvements/sorties",
    {
      quantite: quantite,
      article: artId,
      commande: cmdeId,
    },
    {
      headers: requestHeaders,
    },
  );

  return response.data;
};

export const getAllSortiesByIdCommande = async (idCommande: number) => {
  const response = await axios.get(
    `${BASE_URL}mouvements/commandes/${idCommande}`,
    {
      headers: requestHeaders,
    },
  );

  return response.data;
};

export const getAllEntrees = async () => {
  const response = await axios.get(BASE_URL + "mouvements/entrees", {
    headers: requestHeaders,
  });

  return response.data;
};

export const createMouvementEntree = async (
  quantite: number,
  pu: number,
  artId: number,
  emplId: number,
  justif: string,
) => {
  const response = await axios.post(
    BASE_URL + "mouvements/entrees",
    {
      quantite: quantite,
      prixUnitaire: pu,
      article: artId,
      emplacement: emplId,
      justif: justif,
    },
    {
      headers: requestHeaders,
    },
  );

  return response.data;
};
