import apiClient from '../apiClient';

const path = '/users';

export const CreateAdminUser = async (body: any) => {
    const response = await apiClient.post(`${path}/createAdminUser`, body);
    return response;
};

export const CreateNewUser = async (body: any) => {
    const response = await apiClient.post(`${path}/createNewUser`, body);
    return response;
};


export const Login = async (body: any) => {
    const response = await apiClient.post(`/api/auth/login`, body);
    return response;
}