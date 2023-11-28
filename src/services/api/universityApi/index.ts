import apiClient from '../apiClient';

const path = '/universities';

export const fetchAllUniversities = async () => {
   const response = await apiClient.get(`${path}`);
   return response.data;
};

export const fetchUniversityById = async (id: string) => {
   const response = await apiClient.get(`${path}/${id}`);
   return response.data;
};

export const fetchDeckGroupOfUniversity = async (id: string) => {
   const response = await apiClient.get(`${path}/getDeckGroups/${id}`);
   return response.data;
};
export const updateUniversityById = async (id: string, body: object) => {
   const response = await apiClient.put(`${path}/${id}`, body);
   return response;
}


export const addImageToUniversity = async (id: string, formData: FormData) => {
   const response = await apiClient.put(`${path}/media/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
   return response;
}

export const removeImageFromUniversity = async (id: string, body: object) => {
   const response = await apiClient.put(`${path}/remove-image/${id}`, body)
   return response;
}

export const AddDeckGroup = async (id: string, year: string, body: object) => {
   const response = await apiClient.post(`${path}/createDeckGroupAndAddtoAcadamicYear/${id}/${year}`, body);
   return response;
}


export const createUniversity = async ({ formData }: { formData: FormData }) => {
   const response = await apiClient.post(`${path}`,
      formData,
      {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      });
   return response;
}
