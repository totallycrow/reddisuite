import { useSession } from "next-auth/react";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useFlairController } from "../../hooks/useFlairController";
import { useSubredditController } from "../../hooks/useSubredditController";
import { usePostingController } from "../../hooks/usePostingController";
import { useFormController } from "../../hooks/useFormController";
import { FormItem } from "../FormItem";
import { FormObserver } from "../../utils/formObserver";
import { useFormItemValidation } from "../../hooks/useFormItemValidation";

// const LoadingStatusContext = createContext("Idle");

export interface IPostFormValues {
  title: string;
  link: string;
  subreddit: string;
  triggerLocalChange: any;
}

export const SubmitItem = (postConfig: IPostFormValues) => {
  const { data: session } = useSession();
  const [loadingState, setLoadingState] = useState("Idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formObserver = useMemo(() => FormObserver.getInstance(), []);

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
      setLoadingState,
      setIsSubmitting
    );

  const isFormItemValidated = useFormItemValidation(
    title,
    isTitleTagRequired,
    titleTags,
    link,
    loadingState,
    subData
  );

  const isError = formObserver.getFormItemBySubreddit(userInput)?.isError;

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

    // check if exists and is the same
    if (
      formObserver.isSubredditInList(userInput) &&
      formObserver.areFormItemsIdentical({
        title: title,
        link: link,
        subreddit: userInput,
        sendData: sendData,
        isSubmitted: formObserver.getFormItemBySubreddit(userInput).isSubmitted,
        successfullySubmitted:
          formObserver.getFormItemBySubreddit(userInput).successfullySubmitted,
        validated: isFormItemValidated.isValid,
        flairID: selectedFlair,
        isIdle: formObserver.getFormItemBySubreddit(userInput).isIdle,
        isError: formObserver.getFormItemBySubreddit(userInput).isError,
      })
    ) {
      console.log("DUPLICATE FOUND");
      formObserver.updateFormItem({
        title: title,
        link: link,
        subreddit: userInput,
        sendData: sendData,
        successfullySubmitted: false,
        isSubmitted: false,
        validated: isFormItemValidated.isValid,
        flairID: selectedFlair,
        isIdle: formObserver.getFormItemBySubreddit(userInput).isIdle || false,
        isError:
          formObserver.getFormItemBySubreddit(userInput).isError || false,
      });
      return;
    }

    if (formObserver.isSubredditInList(userInput)) {
      console.log("UPDATING");

      formObserver.updateFormItem({
        title: title,
        link: link,
        subreddit: userInput,
        sendData: sendData,
        successfullySubmitted: false,
        isSubmitted: false,
        validated: isFormItemValidated.isValid,
        flairID: selectedFlair,
        isIdle: formObserver.getFormItemBySubreddit(userInput).isIdle || false,
        isError:
          formObserver.getFormItemBySubreddit(userInput).isError || false,
      });
    } else {
      console.log("ELSE!!");
      formObserver.subscribe({
        sendData: sendData,
        subreddit: userInput,
        title: title,
        link: link,
        successfullySubmitted: false,
        isSubmitted: false,
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
      <h1>Loading Status: {loadingState}</h1>
      <div>Submission Status: {submissionStatus}</div>
      <div>Validation Status: {isFormItemValidated.isValid ? "YES" : "NO"}</div>
      <div>
        Is Idle:{" "}
        {formObserver &&
        formObserver.getFormItemBySubreddit(userInput) &&
        formObserver.getFormItemBySubreddit(userInput).isIdle
          ? "YES"
          : "NO"}
      </div>

      <div>
        {shouldShowSpinner ? (
          <div class="flex items-center justify-center">
            <div
              class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ) : (
          "test2"
        )}
      </div>

      <FormItem config={formConfig} />
      <div className="flex w-full flex-col">
        <div className="divider"></div>
      </div>
    </div>
  );
};
