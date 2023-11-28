import apiClient from '../apiClient';

const path = '/api/deckgroup';

export const fetchalldeckgroups = async () => {
  const response = await apiClient.get(`${path}`);
  return response.data;
};

export const fetchDeckGroupById = async (mcqId: string) => {
  const response = await apiClient.get(`${path}/${mcqId}`);
  return response.data;
};

export const FetchGroupDecks = async (deckgroupId: string) => {
  const response = await apiClient.get(
    `${path}/getPopulatedGroup/${deckgroupId}`
  );
  return response.data;
};
export const CreateAndAddDeckToGroup = async ({ body, }: { body: object; }) => {
  const response = await apiClient.post(
    `/api/decks/createDeckAndAddToGroup`,
    body
  );
  return response.data;
};

export const AddExistingDeckToGroup = async ({
  body,
}: {
  body: object;
}) => {
  const response = await apiClient.post(`${path}/addDeckToGroup`, body);
  return response.data;
};

export const EditDeckGroups = async ({
  deckgroupId,
  deckgroup,
}: {
  deckgroupId: string;
  deckgroup: object;
}) => {
  const response = await apiClient.patch(`${path}/${deckgroupId}`, deckgroup);
  return response.data;
};

export const fetchUniversities = async () => {
  const response = await apiClient.get(`/universities/all`);
  return response.data;
};

export const ReplaceDeckIds = async ({
  id,
  deckIds,
}: {
  id: string;
  deckIds: string[];
}) => {
  const response = await apiClient.patch(
    `${path}/replaceDeckIds/${id}`,
    deckIds
  );
  return response.data;
};
