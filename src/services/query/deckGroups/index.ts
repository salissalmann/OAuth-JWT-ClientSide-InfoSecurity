import { useQuery, useMutation } from "react-query";
import {
  fetchDeckGroupById,
  FetchGroupDecks,
  fetchUniversities,
  CreateAndAddDeckToGroup,
  AddExistingDeckToGroup,
  EditDeckGroups,
  ReplaceDeckIds,
  fetchalldeckgroups,
} from "../../api/deckGroupApi/index";

export const useFetchDeckGroupById = (deckgroupId: string) => {
  return useQuery(["deckDroupById", deckgroupId], () => fetchDeckGroupById(deckgroupId));
};

export const useFetchGroupDecks = (deckgroupId: string) => {
  return useQuery(["groupDecks", deckgroupId], () => FetchGroupDecks(deckgroupId));
};

export const useFetchUniversities = () => {
  return useQuery("universities", () => fetchUniversities())
}

export const useAddDeckToGroup = () => {
  return useMutation(CreateAndAddDeckToGroup);
}

export const useAddExistingDeckToGroup = () => {
  return useMutation(AddExistingDeckToGroup);
}

export const useEditDeckGroups = () => {
  return useMutation(EditDeckGroups);
}

export const useReplaceDeckIds = () => {
  return useMutation(ReplaceDeckIds);
}

export const useFetchDeckGroups = () => {
  return useQuery("deckGroups", fetchalldeckgroups)
}
