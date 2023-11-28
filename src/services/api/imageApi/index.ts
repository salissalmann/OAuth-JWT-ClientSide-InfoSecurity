import apiClient from "../apiClient";

const path = "/upload-image";

export const fetchAllImages = async () => {
  const response = await apiClient.get(`${path}`);
  return response.data;
};
export const createImage = async ({ data }: { data: FormData }) => {
  const response = await apiClient.post(`${path}`, data, {
    headers: { "Content-Type": "multipart/form-data" }, // Set the content type for file upload
  });
  return response.data;
};
