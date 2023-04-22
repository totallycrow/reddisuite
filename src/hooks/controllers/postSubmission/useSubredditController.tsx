import React, { useMemo } from "react";
import { api } from "../../../utils/api";
import { useDebouncedSearch } from "../../utils/useDebouncedSearch";

import { IError } from "./useFlairController";
import { FormObserver } from "../../../utils/formObserver";
import { IFullSubredditData, ISubredditError } from "../../../services/reddit";

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

  const subRedditController = api.reddit.getSubreddit.useQuery(
    { sub: debouncedInput },
    {
      enabled: debouncedInput !== "",
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  function isISubredditError(
    data: IFullSubredditData | ISubredditError | IError | undefined
  ): data is ISubredditError | IError | undefined {
    if (data === undefined) {
      return false;
    }
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

  if (!subData) {
    const subredditUtils = {
      error: "subData undefined",
      isTitleTagRequired: false,
      titleTags: [],
      isSubredditControllerBusy: false,
    };

    return { subRedditController, debouncedStatus, subredditUtils };
  }

  /*
  utils 
  {
    error: ""
  } 
  
  */

  // IF ERROR ******************************
  if (isISubredditError(subData)) {
    formObserver.setIsError(debouncedInput, true);

    const subredditExplanation =
      subData && subData.explanation ? subData.explanation : "";

    const subredditUtils = {
      error: subredditExplanation,
      isTitleTagRequired: false,
      titleTags: [],
      isSubredditControllerBusy: false,
    };

    return { subRedditController, debouncedStatus, subredditUtils };
  }

  const isTitleTagRequired = subData.titleTags.length > 0;
  const titleTags = subData.titleTags || [];

  const isSubredditControllerBusy =
    subRedditController.isLoading ||
    subRedditController.isFetching ||
    subRedditController.isRefetching ||
    subRedditController.isInitialLoading;

  // subRedditController.isLoading ||
  //     subRedditController.isFetching ||
  //     subRedditController.isRefetching ||
  //     subRedditController.isInitialLoading ||

  //   <div>
  //   {subRedditController.data && subRedditController.data.explanation && (
  //     <p>{subRedditController.data.explanation}</p>
  //   )}
  // </div>
  // <div>
  //   {subRedditController.data &&
  //     subRedditController.data.titleTags &&
  //     subRedditController.data.titleTags.length > 0 && (
  //       <p>
  //         Title tag required: &quot;
  //         {subRedditController.data.titleTags[0]}&quot;
  //       </p>
  //     )}
  // </div>

  const subredditUtils = {
    error: "",
    isTitleTagRequired: isTitleTagRequired,
    titleTags: titleTags,
    isSubredditControllerBusy: isSubredditControllerBusy,
  };

  return {
    subRedditController,
    debouncedStatus,
    isTitleTagRequired,
    titleTags,
    subredditUtils,
  };
};
