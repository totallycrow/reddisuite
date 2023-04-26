import { useMemo } from "react";
import { api } from "../../../../utils/api";
import { useDebouncedSearch } from "../../../utils/useDebouncedSearch";
import { FormObserver } from "../../../../utils/formObserver";
import type { IFlair } from "../../../../services/reddit";
import { generateUtils, isISubredditError } from "./utils";

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

  const subData = subRedditController.data;

  async function handleSubChange() {
    await subRedditController.refetch();
    return;
  }

  if (!subData) {
    const subredditUtils = {
      error: "",
      isTitleTagRequired: false,
      titleTags: [] as string[],
      isSubredditControllerBusy: false,
      isFlairRequired: false,
      flairList: [] as IFlair[],
    };

    return { subRedditController, debouncedStatus, subredditUtils };
  }

  // IF ERROR ******************************
  if (isISubredditError(subData)) {
    formObserver.setIsError(debouncedInput, true);

    const subredditExplanation =
      subData && subData.explanation ? subData.explanation : "";

    const subredditUtils = {
      error: subredditExplanation,
      isTitleTagRequired: false,
      titleTags: [] as string[],
      isSubredditControllerBusy: false,
      isFlairRequired: false,
      flairList: [] as IFlair[],
    };

    return { subRedditController, debouncedStatus, subredditUtils };
  }

  const isSubredditControllerBusy =
    subRedditController.isLoading ||
    subRedditController.isFetching ||
    subRedditController.isRefetching ||
    subRedditController.isInitialLoading;

  const subredditUtils = generateUtils(subData, isSubredditControllerBusy);

  return {
    subRedditController,
    debouncedStatus,
    isTitleTagRequired: subredditUtils.isTitleTagRequired,
    titleTags: subredditUtils.titleTags,
    subredditUtils,
  };
};
