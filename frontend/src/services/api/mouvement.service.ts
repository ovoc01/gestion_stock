import axios from "axios";
import { BASE_URL, PaginationProps, requestHeaders } from "../shared/shared";


export const getAllPeriodes = async ({page,size}:PaginationProps) => {
   //console.log(size,page)
   const response = await axios.get(BASE_URL + 'mouvements/periodes?page='+page+'&size='+size, {
      headers: requestHeaders
   })
   return response.data;
}

export const createPeriode = async (label:string,dateDebut:Date) => {
   const response = await axios.post(BASE_URL + 'mouvements/periodes',{
      'periodeLi':label,
      'periodeDtDb':dateDebut
   },{
      headers:requestHeaders
   })
   return response.data;
}

export const updatePeriode = async (periodeId:number,periodeLi:string,dateCreation:Date,dateFin:Date) => {
   const response = await axios.put(BASE_URL + 'mouvements/periodes/'+periodeId,{
      'periodeId':periodeId,
      'periodeLi':periodeLi,
      'periodeDtDb':dateCreation,
      'periodeDtFin':dateFin
   },{
      headers:requestHeaders
   })
   return response.data;
}