import React, { useMemo } from "react";
import { api } from "../utils/api";
import { useDebouncedSearch } from "./useDebouncedSearch";
import { IFullSubredditData, ISubredditError } from "../services/reddit";
import { IError } from "./useFlairController";
import { FormObserver } from "../utils/formObserver";

export const useSubredditController = (
  userInput: string,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>
) => {
  const { debouncedInput, debouncedStatus } = useDebouncedSearch(
    userInput,
    handleSubChange,
    setLoadingState
  );

  const formObserver = useMemo(() => FormObserver.getInstance(), []);

  const subRedditController = api.example.getSubreddit.useQuery(
    { sub: debouncedInput },
    {
      enabled: debouncedInput !== "",
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  function isISubredditError(
    data: IFullSubredditData | ISubredditError | IError
  ): data is ISubredditError | IError {
    const isSubredditError = (data as ISubredditError).message !== undefined;
    const isIError = (data as IError).error !== undefined;

    return isSubredditError || isIError;
  }

  async function handleSubChange() {
    const res = await subRedditController.refetch();
    console.log(subRedditController.data);
    console.log(res);
    return;
  }

  const subData = subRedditController.data;

  if (!subData) return { subRedditController, debouncedStatus };
  if (isISubredditError(subData)) {
    formObserver.setIsError(debouncedInput, true);
    return { subRedditController, debouncedStatus };
  }

  const isTitleTagRequired = subData.titleTags.length > 0;
  const titleTags = subData.titleTags;

  return {
    subRedditController,
    debouncedStatus,
    isTitleTagRequired,
    titleTags,
  };
};
