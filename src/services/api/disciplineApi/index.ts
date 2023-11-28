import apiClient from '../apiClient';

const path = '/disciplines';

export const fetchAllDiscipline = async () => {
   const response = await apiClient.get(`${path}`);
   return response.data;
};

export const createDiscipline = async ({ body }: { body: object }) => {
   const response = await apiClient.post(`${path}`, body);
   return response.data;
};

export const updateDisciplineStatus = async ({ id, body }: { id: string, body: object }) => {
   const response = await apiClient.put(`${path}/status/${id}`, body);
   return response.data;
};
