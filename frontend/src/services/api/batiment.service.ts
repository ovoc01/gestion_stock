import axios from "axios";
const BASE_URL = "http://localhost:8080/";

type PaginationProps = {
   page:number
   size:number
}

export const getAllMagasins = async ({page,size}:PaginationProps) => {
   const response = await axios.get(BASE_URL + "magasins?page="+page+"&size="+size);
   return response.data;
}

export const createMagasin = async (label: string, dateCreation: Date, commentaire: string) => {
   const response = await axios.post(BASE_URL + "magasins", {
      'magLi': label,
      'magDtCr': dateCreation,
      'magCom': commentaire === '' ? null : commentaire
   });
   return response.data;
}