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

  const formObserver = useMemo(() => FormObserver.getInstance(), []);

  // Form Controls
  const { title, setTitle, link, setLink, userInput, setUserInput } =
    useFormController(postConfig.title, postConfig.link, postConfig.subreddit);

  // *********************** DATA FETCH / POST *************************************

  const { subRedditController, isTitleTagRequired, titleTags } =
    useSubredditController(userInput, setLoadingState);

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
    subData
  );

  // LOADING CHECKS
  useEffect(() => {
    if (
      subRedditController.isLoading ||
      subRedditController.isFetching ||
      subRedditController.isRefetching ||
      subRedditController.isInitialLoading
    ) {
      setLoadingState("Loading...");
    } else setLoadingState("Idle");
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
        validated: isFormItemValidated,
        flairID: selectedFlair,
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
        validated: isFormItemValidated,
        flairID: selectedFlair,
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
        validated: isFormItemValidated,
        flairID: selectedFlair,
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
        validated: isFormItemValidated,
        flairID: selectedFlair,
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
  };

  return (
    <div>
      <h1>Loading Status: {loadingState}</h1>
      <div>Submission Status: {submissionStatus}</div>
      <div>Validation Status: {isFormItemValidated ? "YES" : "NO"}</div>
      <FormItem config={formConfig} />
      <div className="flex w-full flex-col">
        <div className="divider"></div>
      </div>
    </div>
  );
};
