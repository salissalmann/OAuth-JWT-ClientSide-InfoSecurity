import { useQuery } from 'react-query';
import { fetchRoles } from '../../api/rolesApi';

export const useFetchRoles = () => {
    return useQuery('roles', fetchRoles);
};