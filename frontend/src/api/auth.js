import axiosInstance from "./axios";

export const loginApi = (email, password) =>
  axiosInstance.post("/login", { email, password });

export const logoutApi = () =>
  axiosInstance.post("/logout");

export const getMeApi = () =>
  axiosInstance.get("/me");
