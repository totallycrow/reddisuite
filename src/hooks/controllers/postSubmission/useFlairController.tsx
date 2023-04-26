import { useEffect, useState } from "react";
import type {
  IFlair,
  IFullSubredditData,
  ISubredditError,
} from "../../../services/reddit";

export const useFlairController = (
  subReddit: IFullSubredditData | ISubredditError | IError
) => {
  const [selectedFlair, setSelectedFlair] = useState("");
  const [isFlairRequired, setIsFlairRequired] = useState(false);
  const [flairList, setFlairList] = useState(Array<IFlair>);

  useEffect(() => {
    if (!subReddit) {
      return;
    }

    if (isISubredditError(subReddit)) {
      setSelectedFlair("");
      return;
    }

    if (
      subReddit.flairs &&
      subReddit.flairs.length > 0 &&
      subReddit.flairs[0] &&
      subReddit.flairs[0].id
    ) {
      setSelectedFlair(subReddit.flairs[0].id);
      setIsFlairRequired(true);
      setFlairList(subReddit.flairs);
    }
  }, [subReddit]);
  return { selectedFlair, setSelectedFlair, isFlairRequired, flairList };
};

export interface IError {
  error: string;
}

//   TYPE GUARD
function isISubredditError(
  data: IFullSubredditData | ISubredditError | IError
): data is ISubredditError | IError {
  const isSubredditError = (data as ISubredditError).message !== undefined;
  const isIError = (data as IError).error !== undefined;

  return isSubredditError || isIError;
}
