import axios from "axios";
import { signOut } from "./auth-client";
import qs from "qs";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001/api";
console.log(API_URL);

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for auto sign out on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await signOut();
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    console.log("Config upr: ", config)
    config.paramsSerializer = params => qs.stringify(params, { arrayFormat: 'brackets', encode: false});
    console.log("Config down: ", config)
    return config;
  }
)

export default api;
