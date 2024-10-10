import axios from "axios";
import { BASE_URL, FetchType, PaginationProps, requestHeaders } from "../../shared/shared";


export const getAllUnite = async ({ page, size ,fetch=FetchType.PAGINATION}: PaginationProps) => {
   BASE_URL + "unites?page=" + page + "&size=" + size
   const response = await axios.get(`${BASE_URL}unites?page=${page}&size=${size}&fetch=${fetch}`, {
      headers: requestHeaders
   });
   //const response = await axios.get(BASE_URL + "magasins?page="+page+"&size="+size);
   return response.data;
}


export const createUnite = async (label: string, abbr: string, dateCreation: Date, commentaire: string) => {
   const response = await axios.post(BASE_URL + "unites", {
      'uniteLi': label,
      'uniteAbrv': abbr,
      'uniteDtCr': dateCreation,
      'uniteCom': commentaire === '' ? null : commentaire,

   }, {
      headers: requestHeaders
   });
   return response.data;
}

export const deleteUnite = async (uniteId: number) => {
   const response = await axios.delete(BASE_URL + `unites/${uniteId}`, {
      headers: requestHeaders
   })
   return response.data;
}

export const updateUnite = async (uniteId: number, label: string, abbr: string, dateCreation: Date, commentaire: string) => {
   const response = await axios.put(BASE_URL + `unites/${uniteId}`, {
      'uniteId': uniteId,
      'uniteLi': label,
      'uniteAbrv': abbr,
      'uniteDtCr': dateCreation,
      'uniteCom': commentaire === '' ? null : commentaire,
   }, {
      headers: requestHeaders
   })
   return response.data;
}


export const getAllFamilles = async ({ page, size }: PaginationProps) => {
   const response = await axios.get(BASE_URL + "familles?page=" + page + "&size=" + size, {
      headers: requestHeaders
   });
   //const response = await axios.get(BASE_URL + "magasins?page="+page+"&size="+size);
   return response.data;
}

export const createFamille = async (label: string, dateCreation: Date) => {
   const response = await axios.post(BASE_URL + "familles", {
      'familleLi': label,
      'familleDtCr': dateCreation,
   }, {
      headers: requestHeaders
   });
   return response.data;
}

export const deleteFamille = async (familleId: number) => {
   const response = await axios.delete(BASE_URL + `familles/${familleId}`, {
      headers: requestHeaders
   })
   return response.data;
}

export const updateFamille = async (familleId: number, label: string, dateCreation: Date) => {
   const response = await axios.put(BASE_URL + `familles/${familleId}`, {
      'familleId': familleId,
      'familleLi': label,
      'familleDtCr': dateCreation,
   }, {
      headers: requestHeaders
   })
   return response.data;
}


export const getAllSousFamilles = async ({ page, size }: PaginationProps) =>{
   const response = await axios.get(BASE_URL + "sous-familles?page=" + page + "&size=" + size, {
      headers: requestHeaders
   });
   //const response = await axios.get(BASE_URL + "magasins?page="+page+"&size="+size);
   return response.data;
}

export const createSousFamille = async (familleId: number, label: string, dateCreation: Date) => {
   const response = await axios.post(BASE_URL + 'sous-familles', {
      'familleId':familleId,
      'sousFamLi':label,
      'sousFamDtCr':dateCreation
   }, {
      headers: requestHeaders
   })

   return response.data
}

export const deleteSousFamille = async (sousFamilleId: number) => {
   const response = await axios.delete(BASE_URL + `sous-familles/${sousFamilleId}`, {
      headers: requestHeaders
   })
   return response.data;
}

export const updateSousFamille = async (sousFamilleId: number, familleId: number, label: string, dateCreation: Date) => {
   const response = await axios.put(BASE_URL + `sous-familles/${sousFamilleId}`, {
      'sousFamId':sousFamilleId,
      'familleId':familleId,
      'sousFamLi':label,
      'sousFamDtCr':dateCreation
   }, {
      headers: requestHeaders
   })

   return response.data

}

export const getAllArticles = async ({ page, size,fetch=FetchType.PAGINATION }: PaginationProps) => {
   const response = await axios.get(`${BASE_URL}articles?page=${page}&size=${size}&fetch=${fetch}`, {
      headers: requestHeaders,
      withCredentials:true
   });
   //const response = await axios.get(BASE_URL + "magasins?page="+page+"&size="+size);
   return response.data;
}

export const createArticle = async (ref: string, label: string, sousFamilleId: number, serviceExploitantId: number, uniteId: number) => {
   const response = await axios.post(BASE_URL + 'articles', {
      'artRef': ref,
      'artLi': label,
      'sousFamId': sousFamilleId,
      'serviceId': serviceExploitantId,
      'uniteId': uniteId
   }, {
      headers: requestHeaders
   })

   return response.data
}

export const deleteArticle = async (articleId: number) => {
   const response = await axios.delete(BASE_URL + `articles/${articleId}`, {
      headers: requestHeaders
   })
   return response.data;
}

export const updateArticle = async (articleId: number, ref: string, label: string, sousFamilleId: number, serviceExploitantId: number, uniteId: number) => {
   const response = await axios.put(BASE_URL + `articles/${articleId}`, {
      'artId': articleId,
      'artRef': ref,
      'artLi': label,
      'sousFamId': sousFamilleId,
      'serviceId': serviceExploitantId,
      'uniteId': uniteId
   }, {
      headers: requestHeaders
   })

   return response.data

}

export const exportArticleExcel = async () => {
   const response = await axios.get(BASE_URL + 'articles/export', {
      headers: requestHeaders
   })
   
   return response
}