import { updateTopic, addSubtopicsToTopic, createTopic, deleteTopic } from './../../api/topicApi/index';
import { useMutation, useQuery } from 'react-query';
import { fetchAllTopics, fetchTopicById, fetchSubtopicsById, removeSubtopicsFromTopic } from '../../api';

// Queries
export const useFetchAllTopics = () => {
   return useQuery('allTopics', fetchAllTopics);
};

export const useFetchTopic = (id: string) => {
   return useQuery(['topic', id], () => fetchTopicById(id));
};

export const useFetchSubtopics = (id: string) => {
   return useQuery(['subtopic', id], () => fetchSubtopicsById(id));
}

// Mutations

export const useCreateTopic = () => {
   return useMutation(createTopic);
}

export const useUpdateTopic = () => {
   return useMutation(updateTopic);
}

export const useAddSubtopicsToTopics = () => {
   return useMutation(addSubtopicsToTopic);
}

export const useRemoveSubtopicsFromTopic = () => {
   return useMutation(removeSubtopicsFromTopic);
}

export const useDeleteTopic = () => {
   return useMutation(deleteTopic);
}


