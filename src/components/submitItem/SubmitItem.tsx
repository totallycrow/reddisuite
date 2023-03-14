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

const LoadingStatusContext = createContext("Idle");

export interface IPostFormValues {
  title: string;
  link: string;
  subreddit: string;
  trigger: any;
  callback: any;
  setTrigger: any;
}

// class Observer {
//   subscribers = [];

//   subscribe({ onSuccess, getData, onError, onLoading, mutate }) {
//     this.subscribers.push({ onSuccess, getData, onError, onLoading });
//   }

//   publish() {
//     const res = [];

//     this.subscribers.forEach((cb) => res.push(cb.getData()));

//     mutate(res);
//   }
// }

// const abc = new Observer();

// // framework specific BINDING
// const useFormObserver = (onSuccess, getData, onError, onLoading) => {
//   useEffect(() => {
//     const unsub = abc.subscribe(() => {
//       return { title, link, userInput, formId: "1321" };
//     });

//     return () => unsub();
//   }, []);
// };

// export { abc };

export const SubmitItem = (postConfig: IPostFormValues) => {
  const [loadingState, setLoadingState] = useState("Idle");

  const formObserver = useMemo(() => FormObserver.getInstance(), []);

  // Form Controls
  // keep controls separate from postConfig
  // need own controls, but on first render check for postCOnfig default values
  const { title, setTitle, link, setLink, userInput, setUserInput } =
    useFormController(postConfig.title, postConfig.link, postConfig.subreddit);
  // const isConfigProvided = postConfig !== undefined;

  // useFormObserver(title, link, userInput);

  // Listen for Main Form Changes

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

  useEffect(() => {
    setTitle(postConfig.title);
    setLink(postConfig.link);
    setUserInput(postConfig.subreddit);
  }, [postConfig.title, postConfig.link, postConfig.subreddit]);

  // LIST FOR LOCAL INPUT CHANGES
  useEffect(() => {
    console.log(
      "oOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOO"
    );
    console.log(title);
    console.log(userInput);
    console.log(selectedFlair);

    console.log(postConfig.subreddit);

    const list = formObserver.getFormItems();

    console.log("IS SUB IN THE LIST???????????????????????????????????????");

    console.log(formObserver.isSubredditInList(userInput));

    const localFormItem = {
      title: title,
      link: link,
      subreddit: userInput,
      sendData: sendData,
    };

    // check if exists and is the same
    if (
      formObserver.isSubredditInList(userInput) &&
      formObserver.areFormItemsIdentical(localFormItem)
    ) {
      console.log("DUPLICATE FOUND");
      return;
    }

    if (formObserver.isSubredditInList(userInput)) {
      console.log("UPDATING");
      console.log(title);
      formObserver.updateFormItem({
        title: title,
        link: link,
        subreddit: userInput,
        sendData: sendData,
      });
    } else {
      console.log("ELSE!!");
      formObserver.subscribe({
        sendData: sendData,
        subreddit: userInput,
        title: title,
        link: link,
      });
    }
  }, [title, link, userInput, selectedFlair, sendData, subData]);

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