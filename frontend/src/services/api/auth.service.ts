import axios from "axios";
import { BASE_URL } from "../shared/shared";

export const login = async (username: string, password: string) => {
   const response = await axios.post(BASE_URL+"auth/login", {
      username,
      password,
   });
   return response.data;
};