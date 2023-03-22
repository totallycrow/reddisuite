import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import { useFlairController } from "../../../hooks/useFlairController";
import { useSubredditController } from "../../../hooks/useSubredditController";
import { usePostingController } from "../../../hooks/usePostingController";
import { useFormController } from "../../../hooks/useFormController";
import { PostItemInputs } from "./PostItemInputs";
import { FormObserver } from "../../../utils/formObserver";
import { useFormItemValidation } from "../../../hooks/useFormItemValidation/useFormItemValidation";

export const PostItem = (postConfig: IPostFormValues) => {
  const [loadingState, setLoadingState] = useState("Idle");

  const formObserver = useMemo(() => FormObserver.getInstance(), []);

  const isSubmitting = formObserver.isAnyInputSubmitting();

  // Form Controls
  const { title, setTitle, link, setLink, userInput, setUserInput } =
    useFormController(postConfig.title, postConfig.link, postConfig.subreddit);

  // *********************** DATA FETCH / POST *************************************

  const {
    subRedditController,
    isTitleTagRequired,
    titleTags,
    debouncedStatus,
  } = useSubredditController(userInput, setLoadingState);

  const subData = subRedditController.data ?? {
    error: "subReddit data not defined",
  };

  const { selectedFlair, setSelectedFlair, isFlairRequired, flairList } =
    useFlairController(subData);
  const { mutationController, sendData, submissionStatus } =
    usePostingController(
      title,
      userInput,
      link,
      selectedFlair,
      setLoadingState
    );

  const isFormItemValidated = useFormItemValidation(
    title,
    isTitleTagRequired,
    titleTags,
    link,
    loadingState,
    subData,
    false
  );

  const isError =
    formObserver.getFormItemBySubreddit(userInput)?.isError || false;

  console.log(isFormItemValidated);

  // LOADING CHECKS
  useEffect(() => {
    if (
      subRedditController.isLoading ||
      subRedditController.isFetching ||
      subRedditController.isRefetching ||
      subRedditController.isInitialLoading ||
      submissionStatus === "LOADING"
    ) {
      setLoadingState("Loading...");
      formObserver.updateIdleStatus(userInput, false);
    } else {
      setLoadingState("Idle");
      formObserver.updateIdleStatus(userInput, true);
    }
  }, [subRedditController.isLoading]);

  // LIST FOR LOCAL INPUT CHANGES
  useEffect(() => {
    postConfig.triggerLocalChange(true);

    if (formObserver.isSubredditInList(userInput)) {
      console.log("UPDATING");

      const idle =
        formObserver.getFormItemBySubreddit(userInput)?.isIdle || false;

      const error =
        formObserver.getFormItemBySubreddit(userInput)?.isError || false;

      formObserver.updateFormItem({
        title: title,
        link: link,
        subreddit: userInput,
        sendData: sendData,
        successfullySubmitted: false,
        isSubmitted: false,
        isSubmitting: false,
        validated: isFormItemValidated.isValid,
        flairID: selectedFlair,
        isIdle: idle,
        isError: error,
      });
    } else {
      console.log("CREATE NEW SUBSCRIBER");
      formObserver.subscribe({
        sendData: sendData,
        subreddit: userInput,
        title: title,
        link: link,
        successfullySubmitted: false,
        isSubmitted: false,
        isSubmitting: false,
        validated: isFormItemValidated.isValid,
        flairID: selectedFlair,
        isIdle: false,
        isError: false,
      });
    }
  }, [
    title,
    link,
    userInput,
    selectedFlair,
    sendData,
    subData,
    isFormItemValidated,
  ]);

  const formConfig = {
    title: title,
    setTitle: setTitle,
    link: link,
    setLink: setLink,
    userInput: userInput,
    setUserInput: setUserInput,
    subRedditController: subRedditController,
    mutationController: mutationController,
    setSelectedFlair,
    sendData,
    submissionStatus,
    loadingState,
    isFormItemValidated,
    isError,
    isSubmitting,
  };

  const isLoading =
    submissionStatus === "LOADING" || loadingState === "Loading...";
  const hasBeenSubmitted =
    formObserver.getFormItemBySubreddit(userInput)?.isSubmitted ||
    formObserver.getFormItemBySubreddit(userInput)?.successfullySubmitted;

  const shouldShowSpinner =
    isLoading ||
    isSubmitting ||
    (debouncedStatus === "Loading..." && !hasBeenSubmitted);

  return (
    <div>
      <h1>
        Is Submitting? :{" "}
        {formObserver.getFormItemBySubreddit(userInput)?.isSubmitting
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
}
