import React from "react";

export type TMutationUtilities = {
  isBusy: boolean;
  mutationIsError: boolean;
  mutationIsErrorData: boolean;
  mutationErrorMessage: string;
  mutationErrorDataMessage: string;
};

export type TSubredditUtilities = {
  error: string;
  isTitleTagRequired: boolean;
  titleTags: string[];
  isSubredditControllerBusy: boolean;
};

export const PostItemFeedback = ({
  mutationUtilities,
  subredditUtils,
}: {
  mutationUtilities: TMutationUtilities;
  subredditUtils: TSubredditUtilities;
}) => {
  const {
    isBusy,
    mutationIsError,
    mutationErrorMessage,
    mutationIsErrorData,
    mutationErrorDataMessage,
  } = mutationUtilities;

  const { error, isTitleTagRequired, titleTags, isSubredditControllerBusy } =
    subredditUtils;

  return (
    <div>
      <div>
        <div>{isBusy && <p>Loading...</p>}</div>
        <div>{mutationIsError && <p>{mutationErrorMessage}</p>}</div>
        <div>{mutationIsErrorData && <p>{mutationErrorDataMessage}</p>}</div>
        <div>{error && <p>{error}</p>}</div>
        <div>
          {isTitleTagRequired && (
            <p>
              Title tag required: &quot;
              {titleTags[0]}&quot;
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
