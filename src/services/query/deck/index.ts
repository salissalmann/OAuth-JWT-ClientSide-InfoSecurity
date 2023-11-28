import { useQuery, useMutation } from "react-query";
import {
  fetchDeckById,
  updateDeckInfo,
  CreateDeckAndAddToDeck,
  FetchDeckTypes
} from "../../api/deckApi/index";

export const useFetchDeckById = (deckId: string) => {
  return useQuery(["deckById", deckId], () => fetchDeckById(deckId));
};

export const useFetchDeckTypes = () => {
  return useQuery('deckTypes', () => FetchDeckTypes())
}

// update Deck Info
export const useUpdateDeckInfo = () => {
  return useMutation(updateDeckInfo);
};

// add question to deck
export const useAddQuestionToDeck = () => {
  return useMutation(CreateDeckAndAddToDeck);
};

export const useFindDeckById = () => {
  return useMutation(fetchDeckById);
};




//comment
