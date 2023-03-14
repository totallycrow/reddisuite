import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { DefinedUseTRPCQueryResult } from "@trpc/react-query/shared";
import { IFullSubredditData, ISubredditError } from "../services/reddit";
import { TRPCClientErrorLike } from "@trpc/client";

export interface IError {
  error: string;
}

export const useFlairController = (
  subReddit: IFullSubredditData | ISubredditError | IError
) => {
  const [selectedFlair, setSelectedFlair] = useState("");
  const [isFlairRequired, setIsFlairRequired] = useState(false);
  const [flairList, setFlairList] = useState(Array<any>);

  //   TYPE GUARD
  function isISubredditError(
    data: IFullSubredditData | ISubredditError | IError
  ): data is ISubredditError | IError {
    const isSubredditError = (data as ISubredditError).message !== undefined;
    const isIError = (data as IError).error !== undefined;

    return isSubredditError || isIError;
  }

  useEffect(() => {
    console.log("GETSUBREDDIT TRIGGER");

    if (!subReddit) {
      console.log("NO GETSUBREDDIT DATA");
      return;
    }

    console.log(subReddit);
    console.log(selectedFlair);

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
