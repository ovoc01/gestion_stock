import axios from "axios";

import {
  BASE_URL,
  FetchType,
  PaginationProps,
  requestHeaders,
} from "@/shared/shared.ts";

export const getAllMagasins = async ({
  page,
  size,
  fetch = FetchType.PAGINATION,
}: PaginationProps) => {
  const response = await axios.get(
    `${BASE_URL}magasins?page=${page}&size=${size}&fetch=${fetch}`,
    {
      headers: requestHeaders,
    },
  );

  //const response = await axios.get(BASE_URL + "magasins?page="+page+"&size="+size);
  return response.data;
};

export const createMagasin = async (
  label: string,
  dateCreation: Date,
  commentaire: string,
) => {
  await axios
    .post(
      BASE_URL + "magasins",
      {
        magLi: label,
        magDtCr: dateCreation,
        magCom: commentaire === "" ? null : commentaire,
      },
      {
        headers: requestHeaders,
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const deleteMagasin = async (magasinId: number) => {
  const response = await axios.delete(BASE_URL + `magasins/${magasinId}`, {
    headers: requestHeaders,
  });

  return response.data;
};

export const updateMagasin = async (
  magasinId: number,
  label: string,
  dateCreation: Date,
  commentaire: string,
) => {
  const response = await axios.put(
    BASE_URL + `magasins/${magasinId}`,
    {
      magId: magasinId,
      magLi: label,
      magDtCr: dateCreation,
      magCom: commentaire === "" ? null : commentaire,
    },
    {
      headers: requestHeaders,
    },
  );

  return response.data;
};

export const getAllEmplacements = async ({
  page,
  size,
  fetch = FetchType.PAGINATION,
}: PaginationProps) => {
  const response = await axios.get(
    `${BASE_URL}emplacements?page=${page}&size=${size}&fetch=${fetch.valueOf()}`,
    {
      headers: requestHeaders,
    },
  );

  return response.data;
};

export const deleteEmplacement = async (emplId: number) => {
  const response = await axios.delete(BASE_URL + `emplacements/${emplId}`, {
    headers: requestHeaders,
  });

  return response.data;
};

export const updateEmplacement = async (
  emplId: number,
  libelle: string,
  magasinId: number,
  serviceId: number,
) => {
  const response = await axios.put(
    BASE_URL + `emplacements/${emplId}`,
    {
      emplId: emplId,
      emplLi: libelle,
      magId: magasinId,
      serviceId: serviceId,
    },
    {
      headers: requestHeaders,
    },
  );

  return response.data;
};

export const createEmplacement = async (
  libelle: string,
  magasinId: number,
  serviceId: number,
) => {
  const response = await axios
    .post(
      BASE_URL + "emplacements",
      {
        emplLi: libelle,
        magId: magasinId,
        serviceId: serviceId,
      },
      {
        headers: requestHeaders,
      },
    )
    .catch((err) => {
      throw err;
    });

  return response.data;
};

export const getAllUtilisateurMagasins = async (usrId: number) => {
  const response = await axios.get(
    BASE_URL + "magasins/utilisateurs/" + usrId,
    {
      headers: requestHeaders,
    },
  );

  return response.data;
};

export const addUtilisateurToMagasin = async (usrId: number, magId: number, debut: Date) => {
  console.log(usrId, magId);
  const response = await axios.post(
    BASE_URL + "magasins/utilisateurs",
    {
      magId: magId,
      usrId: usrId,
      depuis: debut
    },
    {
      headers: requestHeaders,
    },
  );

  return response.data;
};

export const getMagasinDetails = async (magId: number) => {
  const response = await axios.get(`${BASE_URL}magasins/${magId}`, {
    headers: requestHeaders,
  });

  return response.data;
};
