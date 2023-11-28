import apiClient from "../apiClient";

const path = "/modules";

export const fetchAllModules = async () => {
  const response = await apiClient.get(`${path}`);
  return response.data;
};

export const createModule = async ({ body }: { body: object }) => {
  const response = await apiClient.post(`${path}`, body);
  return response.data;
};

export const updateModule = async ({ id, body }: { id: string, body: object }) => {
  const response = await apiClient.put(`${path}/${id}`, body);
  return response.data;
}


export const updateModuleStatus = async ({ id, body }: { id: string, body: object }) => {
  const response = await apiClient.put(`${path}/status/${id}`, body);
  return response.data;
}

export const deleteModule = async ({ id }: { id: string }) => {
  const response = await apiClient.delete(`${path}/${id}`);
  return response.data;
}
