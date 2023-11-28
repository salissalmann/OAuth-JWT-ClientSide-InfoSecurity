import { useMutation, useQuery } from 'react-query';
import { fetchAllUniversities, fetchUniversityById, fetchDeckGroupOfUniversity } from '../../api';
// Queries
export const useFetchAllUniversities = () => {
   return useQuery('allUniversities', fetchAllUniversities);
};

export const useFetchUniversityById = () => {
   return useMutation(fetchUniversityById);
};

export const useFetchDeckGroupOfUniversity = () => {
   return useMutation(fetchDeckGroupOfUniversity);
};



