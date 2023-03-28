import { useEffect, useState } from "react";

import { api } from "../../../utils/api";
import { FormObserver } from "../../../utils/formObserver";

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
  setIsSubmitting?: React.Dispatch<React.SetStateAction<boolean>>,
  postDate,
  setPostDate
) => {
  console.log(title);
  console.log(sub);
  console.log(link);
  console.log(flairID);

  const mutationController = api.reddit.sendPost.useMutation();
  const [submissionStatus, setSubmissionStatus] = useState("IDLE");

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

  const sendData = async () => {
    formObserver.setIsSubmitting(sub, true);
    if (setIsSubmitting) {
      setIsSubmitting(true);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await mutationController.mutateAsync({
      title: title,
      sub: sub,
      link: link,
      flair: flairID,
      date: postDate,
    });
    console.log("ONCLICK END");
    if (setIsSubmitting) {
      setIsSubmitting(false);
    }
    formObserver.setIsSubmitting(sub, false);
    return;
  };

  // ************************************************************************************

  return { mutationController, sendData, submissionStatus };
};
