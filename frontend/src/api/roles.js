import axiosInstance from "./axios";

export const getRolesApi = (params) =>
  axiosInstance.get("/roles", { params });
// params: { page, per_page, search, is_active }

export const getRoleApi = (id) =>
  axiosInstance.get(`/roles/${id}`);

export const createRoleApi = (data) =>
  axiosInstance.post("/roles", data);

export const updateRoleApi = (id, data) =>
  axiosInstance.put(`/roles/${id}`, data);

export const deleteRoleApi = (id) =>
  axiosInstance.delete(`/roles/${id}`);

export const exportRolesExcelApi = (params) =>
  axiosInstance.get("/roles/export-excel", {
    params,
    responseType: "blob",
  });

export const exportRolesPdfApi = (params) =>
  axiosInstance.get("/roles/export-pdf", {
    params,
    responseType: "blob",
  });
