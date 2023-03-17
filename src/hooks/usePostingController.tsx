import { useCallback, useEffect, useState } from "react";
import { api } from "../utils/api";
import { FormObserver } from "../utils/formObserver";

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
  setLoadingState: React.Dispatch<React.SetStateAction<string>>
) => {
  console.log(title);
  console.log(sub);
  console.log(link);
  console.log(flairID);

  const mutationController = api.example.sendPost.useMutation();
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

    if (mutationController.status !== "idle") {
      setLoadingState("Loading...");
      setSubmissionStatus("LOADING");
    }
    if (mutationResponse.errors && mutationResponse.errors.length === 0) {
      console.log("SUCESS");
      console.log(mutationController.data);
      setLoadingState("Idle");
      setSubmissionStatus("SUCCESS");
      formObserver.updateSubmissionStatus(sub, true);
    } else {
      console.log("ERROR POSTING DATA!!");
      setLoadingState("Idle");
      console.log(mutationController.data);
      console.log(mutationController.error);
      setSubmissionStatus("ERROR");
      formObserver.updateSubmissionStatus(sub, false);
    }
  }, [mutationController]);

  useEffect(() => {
    if (mutationController.isLoading) {
      setLoadingState("Loading");
      setSubmissionStatus("LOADING");
    }
  }, [mutationController.isLoading]);

  const sendData = async () => {
    console.log(
      "££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££"
    );
    console.log("_______ SEND DATA _______");
    console.log(title);
    console.log(sub);
    console.log(link);
    console.log(flairID);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const waitforme = (millisec: number) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("");
        }, millisec);
      });
    };

    await waitforme(1000);

    await mutationController.mutateAsync({
      title: title,
      sub: sub,
      link: link,
      flair: flairID,
    });
    console.log("ONCLICK END");
    return;
  };

  return { mutationController, sendData, submissionStatus };
};
