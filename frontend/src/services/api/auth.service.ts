import axios from "axios";
import { BASE_URL, requestHeaders } from "../shared/shared";

export const login = async (username: string, password: string) => {
   const response = await axios.post(BASE_URL + "auth/login", {
      username,
      password,
   });
   return response.data;
};


export const checkUserSessionValidity = async () => {
   console.log(requestHeaders)
   const response = await axios.post(BASE_URL + "auth/user-session-validity",{
      headers:requestHeaders
   })
   return response.data
}