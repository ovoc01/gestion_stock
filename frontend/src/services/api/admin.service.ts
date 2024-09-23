import axios from "axios";
import { BASE_URL, requestHeaders } from "../shared/shared";

export const getAllUtilisateurs = async () => {
   const response = await axios.get(BASE_URL+"admin/utilisateurs",{
      headers:requestHeaders
   });
   return response.data;
}

export const getAllRoles = async () => {
   const response = await axios.get(BASE_URL+"admin/utilisateurs/roles",{
      headers:requestHeaders
   });
   return response.data;
}