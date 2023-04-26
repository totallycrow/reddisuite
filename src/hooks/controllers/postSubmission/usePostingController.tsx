import { useEffect, useState } from "react";
import { api } from "../../../utils/api";
import { FormObserver } from "../../../utils/formObserver";

const formObserver = FormObserver.getInstance();

export const usePostingController = (
  title: string,
  sub: string,
  link: string,
  flairID: string,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
  postDate: number,
  isScheduler: boolean,
  postId: string,
  setIsAnyInputSubmitting: (value: boolean) => void
) => {
  const mutationController = api.reddit.sendPost.useMutation();
  const [submissionStatus, setSubmissionStatus] = useState("IDLE");

  useEffect(() => {
    if (!mutationController.data) {
      return;
    }

    console.log(mutationController.data.json);
    const mutationResponse = mutationController.data.json;

    console.log(
      "MUTATION CONTROLLER STATUS &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&"
    );
    console.log(mutationController.status);
    console.log(mutationResponse);
    mutationResponse.errors;

    console.log(
      "MUTATION CONTROLLER STATUS &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&"
    );
    console.log(mutationController.status);
    console.log(mutationResponse);
    mutationResponse.errors;

    // if (mutationController.status !== "idle") {
    //   setLoadingState("Loading...");
    //   setSubmissionStatus("LOADING");
    //   formObserver.setIsSubmitting(sub, true);
    // }

    if (mutationResponse && mutationResponse.errors !== "") {
      console.log("_________________________");
      setLoadingState("Idle");
      setSubmissionStatus("ERROR");
      formObserver.updateSubmissionStatus(sub, false);
      formObserver.setIsError(sub, true);
      formObserver.setIsSubmitting(sub, false);
    }

    console.log(mutationResponse);

    if (
      mutationResponse.data &&
      Object.keys(mutationResponse.data).length !== 0
    ) {
      console.log("SUCESS");
      console.log(mutationController.data);
      setLoadingState("Idle");
      setSubmissionStatus("SUCCESS");
      formObserver.updateSubmissionStatus(sub, true);
      formObserver.setIsSubmitting(sub, false);
    } else {
      console.log(
        mutationResponse &&
          mutationResponse.errors &&
          mutationResponse.errors === ""
      );
      console.log("ERROR POSTING DATA!!");
      console.log("__________");
      console.log(mutationResponse.errors);
      console.log("__________");
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

  const sendData = async () => {
    console.log("SEND DATA FIRED");
    setIsAnyInputSubmitting(true);
    formObserver.setIsSubmitting(sub, true);
    if (setIsSubmitting) {
      setIsSubmitting(true);
    }
    // await new Promise((resolve) => setTimeout(resolve, 2000));

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
  };

  const isBusy = mutationController.isLoading;
  const mutationIsError =
    mutationController.data &&
    mutationController.data.json &&
    mutationController.data.json.errors.length > 0 &&
    mutationController.data.json.errors[0] &&
    mutationController.data.json.errors[0][1]
      ? true
      : false;

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

  // ************************************************************************************

  return { mutationController, sendData, submissionStatus, mutationUtilities };
};

export interface IPostData {
  title: string;
  sub: string;
  link: string;
  flairID: string;
}
