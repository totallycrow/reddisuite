import { useSession } from "next-auth/react";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { useFlairController } from "../../hooks/useFlairController";
import { useSubredditController } from "../../hooks/useSubredditController";
import { usePostingController } from "../../hooks/usePostingController";
import { useFormController } from "../../hooks/useFormController";
import { FormItem } from "../FormItem";

const LoadingStatusContext = createContext("Idle");

export interface IPostFormValues {
  title: string;
  link: string;
  subreddit: string;
}

export const SubmitItem = (postConfig: IPostFormValues) => {
  const [loadingState, setLoadingState] = useState("Idle");

  // Form Controls
  let { title, setTitle, link, setLink, userInput, setUserInput } =
    useFormController();

  const isConfigProvided = postConfig !== undefined && postConfig.title !== "";

  // *********************** DATA FETCH / POST *************************************

  const { data: session } = useSession();
  const { subRedditController } = useSubredditController(
    userInput,
    setLoadingState
  );

  const subData = subRedditController.data ?? {
    error: "subReddit data not defined",
  };

  const { selectedFlair, setSelectedFlair } = useFlairController(subData);
  const { mutationController, sendData } = usePostingController(
    title,
    userInput,
    link,
    selectedFlair,
    setLoadingState
  );

  let renderTitle, renderLink, renderUserInput;

  if (isConfigProvided) {
    renderTitle = postConfig.title;
    renderLink = postConfig.link;
    renderUserInput = postConfig.subreddit;
  }

  useEffect(() => {
    // USEFFECT SUBMIT ITEM
    console.log(
      ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    );
    console.log("USEFFECT SUBMIT ITEM");
    console.log(isConfigProvided);
    console.log(renderTitle);
    console.log(postConfig);

    if (renderTitle) {
      setTitle(renderTitle);
      setUserInput(renderUserInput);
      setLink(renderLink);
    }
  }, []);

  useEffect(() => {
    if (subRedditController.isLoading) {
      setLoadingState("Loading...");
    } else setLoadingState("Idle");
  }, [subRedditController.isLoading]);

  const formConfig = useMemo(() => {
    return {
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
      renderTitle,
      renderLink,
      renderUserInput,
      onChangeCallback: postConfig.onChangeCallback,
    };
  }, [
    title,
    setTitle,
    link,
    setLink,
    userInput,
    setUserInput,
    mutationController,
    subRedditController,
    sendData,
    setSelectedFlair,
    renderTitle,
    renderLink,
    renderUserInput,
  ]);

  console.log(mutationController.isLoading);
  console.log(subRedditController.isLoading);

  return (
    <LoadingStatusContext.Provider value={loadingState}>
      <div>
        <h1>Status: {loadingState}</h1>
        <FormItem config={formConfig} />
      </div>
    </LoadingStatusContext.Provider>
  );
};
