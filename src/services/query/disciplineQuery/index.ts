import { useMutation, useQuery } from 'react-query';
import { fetchAllDiscipline } from '../../api';
import { createDiscipline, updateDisciplineStatus } from '../../api/disciplineApi';

// Queries
export const useFetchAllDiscipline = () => {
   return useQuery('allDisciplines', fetchAllDiscipline);
};

// Mutations
export const useCreateDiscipline = () => {
   useMutation(createDiscipline)
};


export const useDisciplineUpdateStatus = () => {
   return useMutation(updateDisciplineStatus);
};
