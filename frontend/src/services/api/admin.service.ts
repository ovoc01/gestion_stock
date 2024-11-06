import axios from "axios";

import { BASE_URL, requestHeaders } from "../../shared/shared";

export const getAllUtilisateurs = async (page?: number, size?: number) => {
  page ??= 1;
  size ??= 5
  const response = await axios.get(`${BASE_URL}admin/utilisateurs?page=${page}&size=${size}`, {
    headers: requestHeaders,
  });

  return response.data;
};

export const getAllRoles = async () => {
  const response = await axios.get(BASE_URL + "admin/utilisateurs/roles", {
    headers: requestHeaders,
  });

  return response.data;
};

export const getUtilisateursActiveNumber = async () => {
  const response = await axios.get(BASE_URL + "admin/utilisateurs/counts", {
    headers: requestHeaders,
  });

  return response.data;
};
