import { useEffect, useState } from "react";

import { api } from "../../../utils/api";
import { FormObserver } from "../../../utils/formObserver";
import { addPostToDb } from "../../../services/reddit";

const formObserver = FormObserver.getInstance();

export interface IPostData {
  title: string;
  sub: string;
  link: string;
  flairID: string;
}

export const usePostingController = (
  title: string,
  sub: string,
  link: string,
  flairID: string,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
  postDate: number,
  setPostDate,
  isScheduler: boolean,
  postId: string
) => {
  console.log(title);
  console.log(sub);
  console.log(link);
  console.log(flairID);

  const mutationController = api.reddit.sendPost.useMutation();
  const [submissionStatus, setSubmissionStatus] = useState("IDLE");
  // const dat = mutationController.data;

  useEffect(() => {
    console.log("MUTATION TRIGGER");
    console.log(mutationController);

    if (!mutationController.data) {
      console.log("NO MUTATION DATA");
      return;
    }

    console.log(mutationController.data.json);
    const mutationResponse = mutationController.data.json;

    console.log(
      "MUTATION CONTROLLER STATUS &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&"
    );
    console.log(mutationController.status);
    console.log(mutationResponse);

    if (mutationController.status !== "idle") {
      setLoadingState("Loading...");
      setSubmissionStatus("LOADING");
      formObserver.setIsSubmitting(sub, true);
    }

    if (mutationResponse && mutationResponse.explanation) {
      setSubmissionStatus("ERROR");
      formObserver.updateSubmissionStatus(sub, false);
      formObserver.setIsError(sub, true);
      formObserver.setIsSubmitting(sub, false);
    }

    if (
      mutationResponse &&
      mutationResponse.errors &&
      mutationResponse.errors.length === 0
    ) {
      console.log("SUCESS");
      console.log(mutationController.data);
      setLoadingState("Idle");
      setSubmissionStatus("SUCCESS");
      formObserver.updateSubmissionStatus(sub, true);
      formObserver.setIsSubmitting(sub, false);

      // alert(mutationController.data.json.data.id);
    } else {
      console.log("ERROR POSTING DATA!!");
      setLoadingState("Idle");
      console.log(mutationController.data);
      console.log(mutationController.error);
      setSubmissionStatus("ERROR");
      formObserver.updateSubmissionStatus(sub, false);
      formObserver.setIsError(sub, true);
      formObserver.setIsSubmitting(sub, false);
    }
  }, [mutationController]);

  useEffect(() => {
    if (mutationController.isLoading) {
      setLoadingState("Loading");
      setSubmissionStatus("LOADING");
      formObserver.setIsSubmitting(sub, true);
    }
  }, [mutationController.isLoading]);

  // ************************************************************************************
  // ************************************************************************************// ************************************************************************************
  // ************************************************************************************

  console.log(
    "************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************"
  );
  console.log("IS SHEDULER");
  console.log(isScheduler);

  // ************************************************************************************
  const sendData = async () => {
    formObserver.setIsSubmitting(sub, true);
    if (setIsSubmitting) {
      setIsSubmitting(true);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const submissionDate = isScheduler ? postDate : Date.now();

    await mutationController.mutateAsync({
      title: title,
      sub: sub,
      link: link,
      flair: flairID,
      date: submissionDate,
      isScheduler,
      postId: postId,
    });
    console.log("ONCLICK END");

    if (setIsSubmitting) {
      setIsSubmitting(false);
    }

    formObserver.setIsSubmitting(sub, false);
    return;

    // await scheduleController.mutateAsync({
    //   title: title,
    //   sub: sub,
    //   link: link,
    //   flair: flairID,
    //   date: submissionDate,
    // });
    // console.log("ONCLICK END");

    if (setIsSubmitting) {
      setIsSubmitting(false);
    }
    formObserver.setIsSubmitting(sub, false);
    return;
  };

  // function isError(pet: Fish | Bird): pet is Fish {
  //   return (pet as Fish).swim !== undefined;
  // }

  const isBusy = mutationController.isLoading;
  const mutationIsError =
    mutationController.data &&
    mutationController.data.json &&
    mutationController.data.json.errors.length > 0 &&
    mutationController.data.json.errors[0] &&
    mutationController.data.json.errors[0][1]
      ? true
      : false;

  const checkDataError = () => {};

  const mutationErrorMessage =
    mutationController.data &&
    mutationController.data.json &&
    mutationController.data.json.errors.length > 0 &&
    mutationController.data.json.errors[0] &&
    mutationController.data.json.errors[0][1]
      ? mutationController.data.json.errors[0][1]
      : "";

  const mutationIsErrorData =
    mutationController.data && mutationController.data.json.errors
      ? true
      : false;

  const mutationErrorDataMessage =
    mutationIsErrorData && mutationController.data
      ? mutationController.data.json.errors
      : "";

  const mutationUtilities = {
    isBusy,
    mutationIsError,
    mutationIsErrorData,
    mutationErrorMessage,
    mutationErrorDataMessage,
  };

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

  // ************************************************************************************

  return { mutationController, sendData, submissionStatus, mutationUtilities };
};
