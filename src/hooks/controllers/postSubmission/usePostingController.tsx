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
    const mutationResponse = mutationController.data.json;

    mutationResponse.errors;
    mutationResponse.errors;

    if (mutationResponse && mutationResponse.errors !== "") {
      setLoadingState("Idle");
      setSubmissionStatus("ERROR");
      formObserver.updateSubmissionStatus(sub, false);
      formObserver.setIsError(sub, true);
      formObserver.setIsSubmitting(sub, false);
    }

    if (
      mutationResponse.data &&
      Object.keys(mutationResponse.data).length !== 0
    ) {
      setLoadingState("Idle");
      setSubmissionStatus("SUCCESS");
      formObserver.updateSubmissionStatus(sub, true);
      formObserver.setIsSubmitting(sub, false);
    } else {
      setLoadingState("Idle");
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
    setIsAnyInputSubmitting(true);
    formObserver.setIsSubmitting(sub, true);
    if (setIsSubmitting) {
      setIsSubmitting(true);
    }
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
