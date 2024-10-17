export const BASE_URL = import.meta.env.VITE_SERVER_SPRING_URL as string;

export enum FetchType {
   PAGINATION = 'PAGINATION',
   ALL = 'ALL'
}
export type PaginationProps = {
   page?: number
   size?: number
   fetch?: FetchType
}



export const requestHeaders = {
   'Content-Type': 'application/json',
   'Authorization': 'Bearer ' + localStorage.getItem('token')
}