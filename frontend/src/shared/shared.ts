export const BASE_URL = "http://192.168.1.100:8080/api/v1/";

export enum FetchType {
   PAGINATION= 'PAGINATION',
   ALL='ALL'
}
export type PaginationProps = {
   page?:number
   size?:number
   fetch?:FetchType 
}



export const requestHeaders = {
   'Content-Type': 'application/json',
   'Authorization': 'Bearer ' + localStorage.getItem('token')
}