
import apiClient from '../apiClient';

const path = '/api/roles';

export const fetchRoles = async () => {
    const response = await apiClient.get(`${path}/getroles`);
    return response;
};
