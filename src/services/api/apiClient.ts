import axios from "axios";
import { API_BASE_URL, ENVIRONMENT } from "../../config";
import { isAxiosError } from "axios";


const baseURL =
  ENVIRONMENT === "development" ? API_BASE_URL : "https://ms-api.premed.pk";

export const apiConfig = {
  baseURL,
};

const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  withCredentials: true,
  timeout: 10000,
});

const getCookie = (name: string) => {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};

apiClient.interceptors.request.use((config) => {
  const accessToken = getCookie("accessToken");
  if (accessToken) {
    config.headers["Authorization-Token"] = `${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const response = await apiClient.get(
          `/api/auth/generateAccessToken/${getCookie("refreshToken")}`
        );

        if (response.data && response.data.data.AccessToken) {
          const newAccessToken = response.data.data.AccessToken;
          document.cookie = `accessToken=${newAccessToken}`;
          error.config.headers["Authorization-Token"] = `${newAccessToken}`;
          return apiClient(error.config);
        }
        else{
          window.location.href = "/login";
        }
      }
      catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 401) {
            window.location.href = "/login";
          }
        }
      }
    } 
    return Promise.reject(error);
  }
);

export default apiClient;
