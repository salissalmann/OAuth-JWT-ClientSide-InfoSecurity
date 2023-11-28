import { useMutation, useQuery } from 'react-query';
import { fetchAllSubTopics } from '../../api';
import { createSubTopic, updateSubTopic, deleteSubTopic, updateStatus } from '../../api/subTopicApi';

// Queries
export const useFetchAllSubTopics = () => {
   return useQuery('allSubTopics', fetchAllSubTopics);
};

// Mutations
export const useCreateSubTopic = () => {
   return useMutation(createSubTopic);
};

export const useUpdateSubTopic = () => {
   return useMutation(updateSubTopic);
};

export const useDeleteSubTopic = () => {
   return useMutation(deleteSubTopic);
};

export const useUpdateStatus = () => {
   return useMutation(updateStatus);
};

