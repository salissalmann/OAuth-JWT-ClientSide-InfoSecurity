import apiClient from "../apiClient";

const path = "/questions";
// API Functions
export const fetchAllMcqQuestions = async () => {
  const response = await apiClient.get(`${path}`);
  return response.data;
};
export const fetchAllMcqQuestionsByFilters = async (params: string) => {
  console.log(`Params:  ${path}/filter${params}`);
  const response = await apiClient.get(`${path}/filter${params}`);
  return response.data;
};

export const fetchMcqQuestionById = async (mcqId: string) => {
  const response = await apiClient.get(`${path}/id/${mcqId}`);
  return response.data;
};
export const fetchMcqQuestionDetailById = async (mcqId: string) => {
  const response = await apiClient.get(`${path}/detail/${mcqId}`);
  return response.data;
};
export const findMcqQuestionsWithDetailForIds = async (
  questionIds: string[]
) => {
  const response = await apiClient.post(`${path}/detail/table`, {
    questionIds,
  });
  return response.data;
};

export const createMcqQuestion = async (newMcqQuestionData: object) => {
  const response = await apiClient.post(`${path}`, newMcqQuestionData);
  return response.data;
};

export const updateMcqQuestion = async ({
  mcqId,
  updatedMcqQuestionData,
}: {
  mcqId: string;
  updatedMcqQuestionData: object;
}) => {
  const response = await apiClient.put(
    `${path}/${mcqId}`,
    updatedMcqQuestionData
  );
  return response.data;
};

export const deleteMcqQuestion = async (mcqId: string) => {
  const response = await apiClient.delete(`${path}/${mcqId}`);
  return response.data;
};
