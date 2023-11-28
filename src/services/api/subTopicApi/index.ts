import apiClient from '../apiClient';

const path = '/subtopics';

export const fetchAllSubTopics = async () => {
   const response = await apiClient.get(`${path}`);
   return response.data;
};
export const createSubTopic = async ({ body }: { body: object }) => {
   const response = await apiClient.post(`${path}`, body);
   return response.data;
}

export const updateSubTopic = async ({ id, body }: { id: string, body: object }) => {
   const response = await apiClient.put(`${path}/${id}`, body);
   return response.data;
}

export const deleteSubTopic = async ({ id }: { id: string }) => {
   const response = await apiClient.delete(`${path}/${id}`);
   return response.data;
}

export const updateStatus = async ({ id, body }: { id: string, body: object }) => {
   const response = await apiClient.put(`${path}/status/${id}`, body);
   return response.data;
}
