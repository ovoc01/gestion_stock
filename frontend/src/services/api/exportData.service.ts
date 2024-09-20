import axios from "axios";
import { BASE_URL, requestHeaders } from "../shared/shared";

export const exportArticle = async () => {
   const response = await axios.get(BASE_URL + 'data/articles-csv', {
      headers: requestHeaders
   })
   return response;
}


export const exportPDF = async () => {
   const response = await axios.get(BASE_URL + 'data/articles-pdf', {
      responseType: 'blob',
      headers: requestHeaders
   })
   return response;
}