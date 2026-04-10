import axiosInstance from "./axios";

export const getUsersApi = (params) =>
  axiosInstance.get("/users", { params });
// params: { page, per_page, search, role_id, status }

export const getUserApi = (id) =>
  axiosInstance.get(`/users/${id}`);

export const createUserApi = (data) =>
  axiosInstance.post("/users", data);

export const updateUserApi = (id, data) =>
  axiosInstance.put(`/users/${id}`, data);

export const deleteUserApi = (id) =>
  axiosInstance.delete(`/users/${id}`);

export const exportUsersExcelApi = (params) =>
  axiosInstance.get("/users/export-excel", {
    params,
    responseType: "blob",
  });

export const exportUsersPdfApi = (params) =>
  axiosInstance.get("/users/export-pdf", {
    params,
    responseType: "blob",
  });
