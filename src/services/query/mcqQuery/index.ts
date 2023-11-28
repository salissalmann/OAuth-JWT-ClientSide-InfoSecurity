import { useQuery, useMutation } from 'react-query';
import {
  createMcqQuestion,
  deleteMcqQuestion,
  fetchAllMcqQuestions,
  fetchAllMcqQuestionsByFilters,
  fetchMcqQuestionById,
  fetchMcqQuestionDetailById,
  findMcqQuestionsWithDetailForIds,
  updateMcqQuestion,
} from '../../api';

// Queries
export const useFetchAllMcqQuestions = () => {
  return useQuery('allMcqQuestions', fetchAllMcqQuestions);
};
export const useFetchAllMcqQuestionsByFilters = (params: string) => {
  return useQuery(
    ['allMcqQuestionsByFilter', params],
    () => fetchAllMcqQuestionsByFilters(params),
    {
      refetchOnWindowFocus: false,
      enabled: false, // (!) handle refetchs manually
    }
  );
};

export const useFetchMcqQuestionById = (mcqId: string) => {
  return useQuery(['mcqQuestion', mcqId], () => fetchMcqQuestionById(mcqId), {
    refetchOnWindowFocus: false,
    enabled: false, // (!) handle refetchs manually
  });
};

export const useFetchMcqQuestionDetailById = (mcqId: string) => {
  return useQuery(
    ['mcqQuestionDetailById', mcqId],
    () => fetchMcqQuestionDetailById(mcqId),
    {
      refetchOnWindowFocus: false,
      enabled: false, // (!) handle refetchs manually
    }
  );
};

// Mutations
export const useCreateMcqQuestion = () => {
  return useMutation(createMcqQuestion);
};
export const useFindMcqQuestionsWithDetailForIds = () => {
  return useMutation(findMcqQuestionsWithDetailForIds);
};

export const useUpdateMcqQuestion = () => {
  return useMutation(updateMcqQuestion);
};

export const useDeleteMcqQuestion = () => {
  return useMutation(deleteMcqQuestion);
};
