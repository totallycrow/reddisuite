import React from "react";
import { api } from "../utils/api";
import { useDebouncedSearch } from "./useDebouncedSearch";

export const useSubredditController = (
  userInput: string,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>
) => {
  const { debouncedInput, debouncedStatus } = useDebouncedSearch(
    userInput,
    handleSubChange,
    setLoadingState
  );

  const subRedditController = api.example.getSubreddit.useQuery(
    { sub: debouncedInput },
    {
      enabled: debouncedInput !== "",
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  async function handleSubChange() {
    const res = await subRedditController.refetch();
    console.log(subRedditController.data);
    console.log(res);
    return;
  }

  return { subRedditController, debouncedStatus };
};
