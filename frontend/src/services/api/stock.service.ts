import axios from "axios";
import { BASE_URL, requestHeaders } from "../../shared/shared";

export const getValorisationStock = async (magId: number, emplId: number, code: string) => {
   const response = await axios.post(`${BASE_URL}stocks/valorisations`, {
      'magId': magId,
      'emplId': emplId,
      'code': code
   }, {
      headers: requestHeaders
   })
   return response.data
}