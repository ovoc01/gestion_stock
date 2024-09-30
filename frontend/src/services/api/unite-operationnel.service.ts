import axios from "axios";
import { BASE_URL,PaginationProps,requestHeaders } from "../../shared/shared";


export const getAllUniteOperationnel = async ({page,size}:PaginationProps) => {
   const response = await axios.get(`${BASE_URL}unite-operationnels?page=${page}&size=${size}`, {
      headers:requestHeaders
   })
   return response.data
}

export const createUniteOperationnel = async (numbu:string,buli:string,numAffaire:string,mdmId:string,label:string,{lng,lat}:{lng:number,lat:number}) => {
   const response = await axios.post(`${BASE_URL}unite-operationnels`,{
      'unopNumBu':numbu,
      'unopLiBu':buli,
      'unopLiNumAff':numAffaire,
      'unopMatrnId':mdmId,
      'unopLi':label,
      'unopLng':lng,
      'unopLtd':lat,
   },{
      headers:requestHeaders
   })
   return response.data
}

export const deleteUniteOperationnel = async (unopId:number) => {
   const response = await axios.delete(`${BASE_URL}unite-operationnels/${unopId}`,{
      headers:requestHeaders
   })
   return response.data
}

export const updateUniteOperationnel = async (unopId:number,numbu:string,buli:string,numAffaire:string,mdmId:string,label:string,{lng,lat}:{lng:number,lat:number}) => {
   const response = await axios.put(`${BASE_URL}unite-operationnels/${unopId}`,{
      'unopId':unopId,
      'unopNumBu':numbu,
      'unopLiBu':buli,
      'unopLiNumAff':numAffaire,
      'unopMatrnId':mdmId,
      'unopLi':label,
      'unopLng':lng,
      'unopLtd':lat,
   },{
      headers:requestHeaders
   })
   return response.data
}