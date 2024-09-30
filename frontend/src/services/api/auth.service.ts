import axios from "axios";
import { BASE_URL, requestHeaders } from "../../shared/shared";
import { RegistrationPayload } from "@/types/types";

export const login = async (username: string, password: string) => {
   const response = await axios.post(BASE_URL + "auth/login", {
      username,
      password,
   });
   return response.data;
};


export const checkUserSessionValidity = async () => {
   console.log(requestHeaders)
   const response = await axios.post(BASE_URL + "auth/user-session-validity", {
      headers: requestHeaders
   })
   return response.data
}


export const registerUser = async (registration:RegistrationPayload) => {
   const response = await axios.post(BASE_URL + "auth/register", {
      ...registration
   },{
      headers:requestHeaders
   })
   return response.data
}