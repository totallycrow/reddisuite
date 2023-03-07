import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { DefinedUseTRPCQueryResult } from "@trpc/react-query/shared";
import { IFullSubredditData, ISubredditError } from "../services/reddit";
import { TRPCClientErrorLike } from "@trpc/client";

export const useFlairController = (
  subReddit: IFullSubredditData | ISubredditError
) => {
  const [selectedFlair, setSelectedFlair] = useState("");

  //   TYPE GUARD
  function isISubredditError(
    data: IFullSubredditData | ISubredditError
  ): data is ISubredditError {
    return (data as ISubredditError).message !== undefined;
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
    }
  }, [subReddit]);
  return {selectedFlair, setSelectedFlair}
};
