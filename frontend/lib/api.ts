import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";
import { SearchCarsParams, SearchReservationsParams } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const carsApi = {
  getAll: () => api.get("/cars"),
  getById: (vin: string) => api.get(`/cars/vin/${vin}`),
  create: (data: unknown) => api.post("/cars", data),
  update: (vin: string, data: unknown) => api.put(`/cars/vin/${vin}`, data),
  delete: (vin: string) => api.delete(`/cars/vin/${vin}`),
  getByMake: (make: string) => api.get(`/cars/make/${make}`),
  getByColor: (color: string) => api.get(`/cars/color/${color}`),
  getByYear: (year: number) => api.get(`/cars/year/${year}`),
  search: (params: SearchCarsParams) => api.get("/cars/search", { params }),
  getMostExpensive: () => api.get("/cars/most-expensive"),
  getCheapest: () => api.get("/cars/cheapest"),
  getNewest: () => api.get("/cars/newest"),
  getAverageMileage: () => api.get("/cars/average-mileage"),
};

export const usersApi = {
  getAll: () => api.get("/users"),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (data: unknown) => api.post("/users", data),
  update: (id: number, data: unknown) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

export const reservationsApi = {
  getAll: () => api.get("/reservations"),
  getById: (id: number) => api.get(`/reservations/${id}`),
  create: (data: unknown) => api.post("/reservations", data),
  update: (id: number, data: unknown) => api.put(`/reservations/${id}`, data),
  delete: (id: number) => api.delete(`/reservations/${id}`),
  search: (params: SearchReservationsParams) => api.get("/reservations/search", { params }),
};

export default api;
