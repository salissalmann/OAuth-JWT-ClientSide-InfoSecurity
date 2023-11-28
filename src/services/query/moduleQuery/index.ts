import { useQuery, useMutation } from 'react-query';
import { fetchAllModules, createModule, updateModule, updateModuleStatus, deleteModule } from '../../api/modulesApi'

// Queries
export const useFetchAllModules = () => {
   return useQuery('allModules', fetchAllModules);
};

export const useCreateModule = () => {
   return useMutation(createModule)
}

export const useUpdateModule = () => {
   return useMutation(updateModule);
};

export const useDeleteModule = () => {
   return useMutation(deleteModule);
};

export const useUpdateModuleStatus = () => {
   return useMutation(updateModuleStatus);
};