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

const LoadingStatusContext = createContext("Idle");

export interface IPostFormValues {
  title: string;
  link: string;
  subreddit: string;
  trigger: any;
  callback: any;
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
  // const [isFormItemValidated, setIsFormItemValidated] = useState(false);

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
    loadingState
  );

  // *****************************************************************
  // *****************************************************************
  // *****************************************************************
  console.log(
    " // ***************************************************************** // ***************************************************************** // *****************************************************************"
  );
  console.log(subData);
  console.log(isFormItemValidated);

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

  useEffect(() => {
    setTitle(postConfig.title);
  }, [postConfig.title]);

  useEffect(() => {
    setLink(postConfig.link);
  }, [postConfig.link]);

  useEffect(() => {
    setUserInput(postConfig.subreddit);
  }, [postConfig.subreddit]);

  // LIST FOR LOCAL INPUT CHANGES
  useEffect(() => {
    console.log(
      "oOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOOoOOOOOOOOOOOO"
    );
    console.log(title);
    console.log(userInput);
    console.log(selectedFlair);

    console.log(postConfig.subreddit);

    postConfig.trigger(true);

    const list = formObserver.getFormItems();

    console.log("IS SUB IN THE LIST???????????????????????????????????????");

    console.log(formObserver.isSubredditInList(userInput));

    // const localFormItem = {
    //   title: title,
    //   link: link,
    //   subreddit: userInput,
    //   sendData: sendData,
    //   successfullySubmitted: false,
    //   validated: isFormItemValidated,
    // };

    // check if exists and is the same
    if (
      formObserver.isSubredditInList(userInput) &&
      formObserver.areFormItemsIdentical({
        title: title,
        link: link,
        subreddit: userInput,
        sendData: sendData,
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
        validated: isFormItemValidated,
        flairID: selectedFlair,
      });
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
        successfullySubmitted: false,
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
    submissionStatus,
    loadingState,
    isFormItemValidated,
  };

  console.log(mutationController.isLoading);
  console.log(subRedditController.isLoading);

  return (
    <LoadingStatusContext.Provider value={loadingState}>
      <div>
        <h1>Loading Status: {loadingState}</h1>
        <div>Submission Status: {submissionStatus}</div>
        <div>Validation Status: {isFormItemValidated ? "YES" : "NO"}</div>
        <FormItem config={formConfig} />
      </div>
    </LoadingStatusContext.Provider>
  );
};
