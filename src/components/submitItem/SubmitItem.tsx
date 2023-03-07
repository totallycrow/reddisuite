import { useSession } from "next-auth/react";
import React, { createContext, useMemo, useState } from "react";
import { useFlairController } from "../../hooks/useFlairController";
import { useSubredditController } from "../../hooks/useSubredditController";
import { usePostingController } from "../../hooks/usePostingController";
import { useFormController } from "../../hooks/useFormController";
import { FormItem } from "../FormItem";

const LoadingStatusContext = createContext("Idle");

export const SubmitItem = () => {
  const [loadingState, setLoadingState] = useState("Idle");

  // Form Controls
  const { title, setTitle, link, setLink, userInput, setUserInput } =
    useFormController();

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
  ]);

  console.log(mutationController.isLoading);
  console.log(subRedditController.isLoading);

  if (session) {
    return (
      <LoadingStatusContext.Provider value={loadingState}>
        <div>
          <h1>Status: {loadingState}</h1>
          <FormItem config={formConfig} />
        </div>
      </LoadingStatusContext.Provider>
    );
  }
  return (
    <div>
      <p>Access Denied</p>
    </div>
  );
};
