import React, { useEffect, useMemo, useState } from "react";
import { FormObserver } from "../../../utils/formObserver";
import { useFormController } from "./useFormController";
import { IPostFormValues } from "../../../components/modules/postSubmission/postItem/PostItem";
import { useFlairController } from "./useFlairController";

import { useFormItemValidation } from "../../validation/useFormItemValidation/useFormItemValidation";
import { useSubredditController } from "./useSubredditController";
import { usePostingController } from "./usePostingController";

export const usePostItemManager = (postConfig: IPostFormValues) => {
  const [loadingState, setLoadingState] = useState("Idle");
  const [postDate, setPostDate] = useState(Date.now());

  const formObserver = useMemo(() => FormObserver.getInstance(), []);
  const isSubmitting = formObserver.isAnyInputSubmitting();

  // Form Controls
  const { title, setTitle, link, setLink, userInput, setUserInput } =
    useFormController(postConfig.title, postConfig.link, postConfig.subreddit);

  console.log(
    "************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************"
  );
  console.log("POST CONFIG");
  console.log(postConfig);

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
      () => "",
      postDate,
      setPostDate,
      postConfig.controllerConfig.schedulerModule,
      postConfig.postId
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
    // setPostDate(Date.now());

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
    isAnyInputSubmitting: postConfig.isAnyInputSubmitting,
    setIsAnyInputSubmitting: postConfig.setIsAnyInputSubmitting,
    postDate,
    setPostDate,
    controllerConfig: postConfig.controllerConfig,
  };

  const isLoading =
    submissionStatus === "LOADING" || loadingState === "Loading...";
  const hasBeenSubmitted =
    formObserver.getFormItemBySubreddit(userInput)?.isSubmitted ||
    formObserver.getFormItemBySubreddit(userInput)?.successfullySubmitted;

  const shouldShowSpinner =
    isLoading ||
    isSubmitting ||
    postConfig.isAnyInputSubmitting ||
    (debouncedStatus === "Loading..." && !hasBeenSubmitted);

  

  // <div>{mutationController.isLoading && <p>Loading...</p>}</div>
  // <div>
  //   {mutationController.data &&
  //     mutationController.data.json &&
  //     mutationController.data.json.errors.length > 0 && (
  //       <p>{mutationController.data.json.errors[0][1]}</p>
  //     )}
  // </div>
  // <div>
  //   {mutationController.data && mutationController.data.error && (
  //     <p>{mutationController.data.message}</p>
  //   )}
  // </div>
  // <div>
  //   {subRedditController.data && subRedditController.data.explanation && (
  //     <p>{subRedditController.data.explanation}</p>
  //   )}
  // </div>
  // <div>
  //   {subRedditController.data &&
  //     subRedditController.data.titleTags &&
  //     subRedditController.data.titleTags.length > 0 && (
  //       <p>
  //         Title tag required: &quot;
  //         {subRedditController.data.titleTags[0]}&quot;
  //       </p>
  //     )}
  // </div>

  return {
    formObserver,
    loadingState,
    submissionStatus,
    isFormItemValidated,
    userInput,
    shouldShowSpinner,
    formConfig,
    postDate,
    setPostDate,
  };
};
