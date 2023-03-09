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

const LoadingStatusContext = createContext("Idle");

export interface IPostFormValues {
  title: string;
  link: string;
  subreddit: string;
  trigger: any;
  callback: any;
  setTrigger: any;
}

export const SubmitItem = (postConfig: IPostFormValues) => {
  const [loadingState, setLoadingState] = useState("Idle");
  const [title, setTitle] = useState("");

  // Form Controls
  // keep controls separate from postConfig
  // need own controls, but on first render check for postCOnfig default values
  const { link, setLink, userInput, setUserInput } = useFormController();
  // const isConfigProvided = postConfig !== undefined;

  useEffect(() => {
    console.log(
      "oOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOO"
    );
    console.log(title);
    console.log(userInput);
    setTitle(postConfig.title);
    setLink(postConfig.link);
    setUserInput(postConfig.subreddit);
    console.log(postConfig.subreddit);
  }, []);

  // let renderTitle, renderLink, renderUserInput;

  // if (isConfigProvided) {
  //   renderTitle = postConfig.title;
  //   renderLink = postConfig.link;
  //   renderUserInput = postConfig.subreddit;
  // }

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

  useEffect(() => {
    if (subRedditController.isLoading) {
      setLoadingState("Loading...");
    } else setLoadingState("Idle");
  }, [subRedditController.isLoading]);

  // const formConfig = useMemo(() => {
  //   return {
  //     title: title,
  //     setTitle: setTitle,
  //     link: link,
  //     setLink: setLink,
  //     userInput: userInput,
  //     setUserInput: setUserInput,
  //     subRedditController: subRedditController,
  //     mutationController: mutationController,
  //     setSelectedFlair,
  //     sendData,
  //     renderTitle,
  //     renderLink,
  //     renderUserInput,
  //     onChangeCallback: postConfig.onChangeCallback,
  //   };
  // }, [
  //   title,
  //   setTitle,
  //   link,
  //   setLink,
  //   userInput,
  //   setUserInput,
  //   mutationController,
  //   subRedditController,
  //   sendData,
  //   setSelectedFlair,
  //   renderTitle,
  //   renderLink,
  //   renderUserInput,
  // ]);

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
  };

  useEffect(() => {
    if (!postConfig.trigger) return;
    console.log(
      "[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]"
    );
    console.log("button triggered from");
    console.log(link);
    console.log(postConfig.link);
    console.log(userInput);
    console.log(postConfig.subreddit);
    postConfig.callback((prev) => prev + 1);
    postConfig.setTrigger(false);
  }, [postConfig.trigger]);

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
