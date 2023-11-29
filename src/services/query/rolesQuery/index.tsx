import { useQuery } from 'react-query';
import { fetchRoles } from '../../api/rolesApi';
import { Login } from '../../api/userApi';

export const useFetchRoles = () => {
    return useQuery('roles', fetchRoles);
};

export const useLogin = () => {
    return useQuery('login', Login);
}