import { IRelation } from '../../../pages/Decks/Interfaces';
import apiClient from '../apiClient';
const path = '/api/decks';

export const fetchDeckById = async (deckId: string) => {
  const response = await apiClient.get(`${path}/${deckId}`);
  return response.data;
};

export const updateDeckInfo = async ({
  deckId,
  body,
}: {
  deckId: string;
  body: object;
}) => {
  const response = await apiClient.patch(`${path}/${deckId}`, body);
  return response.data;
};

export const CreateDeckAndAddToDeck = async ({
  deckId,
  body,
}: {
  deckId: string;
  body: {
    relations: IRelation[];
    questionIds: string[];
  };
}) => {
  const response = await apiClient.post(
    `${path}/addQuestionToDeck/${deckId}`,
    body
  );
  return response.data;
};

export const FetchDeckTypes = async () => {
  const response = await apiClient.post(`${path}/getDeckTypes`);
  return response.data;
}
