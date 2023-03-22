import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import { useFlairController } from "../../../hooks/useFlairController";
import { useSubredditController } from "../../../hooks/useSubredditController";
import { usePostingController } from "../../../hooks/usePostingController";
import { useFormController } from "../../../hooks/useFormController";
import { PostItemInputs } from "./PostItemInputs";
import { FormObserver } from "../../../utils/formObserver";
import { useFormItemValidation } from "../../../hooks/useFormItemValidation/useFormItemValidation";
import { usePostItemManager } from "../../../hooks/usePostItemManager";

export const PostItem = (postConfig: IPostFormValues) => {
  const {
    formObserver,
    userInput,
    loadingState,
    submissionStatus,
    formConfig,
    isFormItemValidated,
    shouldShowSpinner,
  } = usePostItemManager(postConfig);

  return (
    <div>
      <h1>
        Is Submitting? :{" "}
        {formObserver.getFormItemBySubreddit(userInput)?.isSubmitting ||
        postConfig.isAnyInputSubmitting
          ? "YES"
          : "NO"}
      </h1>
      <h1>Loading Status: {loadingState}</h1>
      <div>Submission Status: {submissionStatus}</div>
      <div>Validation Status: {isFormItemValidated.isValid ? "YES" : "NO"}</div>
      <div>
        Is Idle:{" "}
        {formObserver &&
        formObserver.getFormItemBySubreddit(userInput) &&
        formObserver.getFormItemBySubreddit(userInput)?.isIdle
          ? "YES"
          : "NO"}
      </div>
      <h3 className="px-4 pt-4 text-lg font-bold">r/{userInput}</h3>

      <div>
        {shouldShowSpinner ? (
          <div className="flex items-center justify-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      <PostItemInputs config={formConfig} />
      <div className="flex w-full flex-col">
        <div className="divider"></div>
      </div>
    </div>
  );
};

export interface IPostFormValues {
  title: string;
  link: string;
  subreddit: string;
  triggerLocalChange: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAnyInputSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  isAnyInputSubmitting: boolean;
}
