import apiClient from '../apiClient';
const path = '/curriculum';

export const fetchCurriculumById = async (curriculumId: string) => {
    const response = await apiClient.get(`${path}/${curriculumId}`);
    return response.data;
};

export const AddCurriculum = async (id: string, body: object) => {
    const response = await apiClient.post(`${path}/${id}`, body);
    return response.data;
}
