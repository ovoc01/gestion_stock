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

export const getAllCommandes = async () => {
   const response = await axios.get(BASE_URL + 'mouvements/commandes',{
      headers:requestHeaders
   })
   return response.data;
}

export const createCommande = async (emplId:number,unopId:number) => {
   const response = await axios.post(BASE_URL + 'mouvements/commandes',{
      'emplId':emplId,
      'unopId':unopId
   },{
      headers:requestHeaders
   })
   return response.data;
}

export const getAllSorties = async ()=>{
   const response = await axios.get(BASE_URL + 'mouvements/sorties',{
      headers:requestHeaders
   })
   return response.data;
}

export const createMouvementSortie = async (quantite:number,pu:number,artId:number,cmdeId:number) =>{
   const response = await axios.post(BASE_URL + 'mouvements/sorties',{
         'cmdeLigneQte':quantite,
         'cmdeLignePu':pu,
         'artId':artId,
         'cmdeId':cmdeId
   },{
      headers:requestHeaders
   })
   return response.data;
}