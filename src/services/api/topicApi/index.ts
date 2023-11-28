import apiClient from '../apiClient';

const path = '/topics';

export const fetchAllTopics = async () => {
   const response = await apiClient.get(`${path}`);
   return response.data;
};

export const fetchTopicById = async (id: string) => {
   const response = await apiClient.get(`${path}/${id}`);
   return response.data;
};


export const fetchSubtopicsById = async (id: string) => {
   const response = await apiClient.get(`${path}/getSubTopicsForTopic/${id}`);
   return response.data;
};

export const createTopic = async ({ formData }: { formData: FormData }) => {
   const response = await apiClient.post(`${path}`,
      formData,
      {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      });
   return response;
}

export const updateTopic = async ({ body }: { body: object }) => {
   const response = await apiClient.put(`${path}/editTopic`, body);
   return response.data;
}

export const addSubtopicsToTopic = async ({ id, body }: { id: string, body: object }) => {
   const response = await apiClient.put(`${path}/addSubtopicsToTopic/${id}`, body);
   return response.data;
}

export const removeSubtopicsFromTopic = async ({ id, body }: { id: string, body: object }) => {
   const response = await apiClient.put(`${path}/removeSubtopicsFromTopic/${id}`, body);
   return response.data;
}

export const deleteTopic = async ({ id }: { id: string }) => {
   const response = await apiClient.delete(`${path}/${id}`);
   return response.data;
}



