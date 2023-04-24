import type {
  IFullSubredditData,
  ISubredditError,
} from "../../../../services/reddit";
import type { IError } from "../useFlairController";

export const generateUtils = (subData: IFullSubredditData, isBusy: boolean) => {
  const isTitleTagRequired = subData.titleTags.length > 0;
  const titleTags = subData.titleTags;

  const isFlairRequired =
    subData.flairs && subData.flairs.length > 0 ? true : false;

  const flairList = subData.flairs;

  const subredditUtils = {
    error: "",
    isTitleTagRequired: isTitleTagRequired,
    titleTags: titleTags,
    isSubredditControllerBusy: isBusy,
    isFlairRequired: isFlairRequired,
    flairList: flairList,
  };

  return subredditUtils;
};

export function isISubredditError(
  data: IFullSubredditData | ISubredditError | IError | undefined
): data is ISubredditError | IError | undefined {
  if (data === undefined) {
    return false;
  }
  const isSubredditError = (data as ISubredditError).message !== undefined;
  const isIError = (data as IError).error !== undefined;

  return isSubredditError || isIError;
}
