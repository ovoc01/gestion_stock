export const BASE_URL = "http://localhost:8080/api/v1/";

export type PaginationProps = {
   page?:number
   size?:number
}

export const requestHeaders = {
   'Content-Type': 'application/json',
   'Authorization': 'Bearer ' + localStorage.getItem('token')
}