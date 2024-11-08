import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { BASE_URL, requestHeaders } from "../../shared/shared";

import { RegistrationPayload, UserClaims } from "@/types/types";
import { USER_LANDING_URL } from "@/config/constant";

export const login = async (username: string, password: string) => {
  const response = await axios.post(BASE_URL + "auth/login", {
    username,
    password,
  });

  return response.data;
};

export const buildUserClaims = (token: string) => {
  const decodedData: any = jwtDecode(token);
  //console.log(decodedData)
  const userClaims: UserClaims = {
    username: decodedData.username,
    role: decodedData.role,
  };

  return userClaims;
};

export const checkUserSessionValidity = (token: string) => {
  try {
    const decodedToken = jwtDecode(token!);
    const currentTime = Date.now() / 10000;

    return decodedToken.exp! < currentTime;
  } catch (error) {
    console.log(error);

    return false;
  }
};

export const registerUser = async (registration: RegistrationPayload) => {
  const response = await axios.post(
    BASE_URL + "auth/register",
    {
      ...registration,
    },
    {
      headers: requestHeaders,
    },
  );

  return response.data;
};


export const getUserLandingUrl = (token: string) => {
  const userClaims: UserClaims = buildUserClaims(token);
  return USER_LANDING_URL.get(userClaims.role!);
}