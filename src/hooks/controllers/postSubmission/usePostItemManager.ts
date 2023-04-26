import React, { useEffect, useMemo, useState } from "react";
import { FormObserver } from "../../../utils/formObserver";
import { useFormController } from "./useFormController";
import { IPostFormValues } from "../../../components/modules/postSubmission/postItem/PostItem";
import { useFlairController } from "./useFlairController";

import { useFormItemValidation } from "../../validation/useFormItemValidation/useFormItemValidation";
import { useSubredditController } from "./useSubredditController/useSubredditController";
import { usePostingController } from "./usePostingController";

export const usePostItemManager = (postConfig: IPostFormValues) => {
  const [loadingState, setLoadingState] = useState("Idle");
  const [postDate, setPostDate] = useState(Date.now());

  const formObserver = useMemo(() => FormObserver.getInstance(), []);
  const isSubmitting = formObserver.isAnyInputSubmitting();

  const [borderColour, setBorderColour] = useState("default");

  // Form Controls
  const { title, setTitle, link, setLink, userInput, setUserInput } =
    useFormController(postConfig.title, postConfig.link, postConfig.subreddit);

  // *********************** DATA FETCH / POST *************************************

  const {
    subRedditController,
    isTitleTagRequired,
    titleTags,
    debouncedStatus,
    subredditUtils,
  } = useSubredditController(userInput, setLoadingState);

  const subData = subRedditController.data ?? {
    error: "subReddit data not defined",
  };

  const { selectedFlair, setSelectedFlair } = useFlairController(subData);

  const { mutationController, sendData, submissionStatus, mutationUtilities } =
    usePostingController(
      title,
      userInput,
      link,
      selectedFlair,
      setLoadingState,
      () => "",
      postDate,
      postConfig.controllerConfig.schedulerModule,
      postConfig.postId,
      postConfig.setIsAnyInputSubmitting
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
      subredditUtils.isSubredditControllerBusy ||
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

  const isLoading =
    submissionStatus === "LOADING" || loadingState === "Loading...";
  const hasBeenSubmitted =
    formObserver.getFormItemBySubreddit(userInput)?.isSubmitted ||
    formObserver.getFormItemBySubreddit(userInput)?.successfullySubmitted;

  const isSubmittedOK = submissionStatus === "SUCCESS";

  const isButtonDisabled =
    title === "" ||
    link === "" ||
    userInput === "" ||
    isSubmittedOK ||
    isLoading ||
    isSubmitting ||
    !isFormItemValidated.isValid
      ? true
      : false;

      
  const formItem = formObserver.getFormItemBySubreddit(userInput);

  useEffect(() => {
    const border = isSubmittedOK
      ? "green"
      : submissionStatus === "ERROR" || isError
      ? "red"
      : "default";
    setBorderColour(border);
  }, [isSubmittedOK, isLoading, isError, submissionStatus]);

  // *******************************

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
    configController: postConfig.controllerConfig,
  };

  const shouldShowSpinner =
    isLoading ||
    isSubmitting ||
    postConfig.isAnyInputSubmitting ||
    (debouncedStatus === "Loading..." && !hasBeenSubmitted);

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
    isLoading,
    isButtonDisabled,
    formItem,
    mutationUtilities,
    subredditUtils,
    isSubmittedOK,
    borderColour,
  };
};
