import { useCallback, useEffect, useState } from "react";
import { api } from "../utils/api";

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

    // on fail:
    // --> .errors -> []

    // on success
    // --> data.id / .name / .url
    if (mutationResponse.errors && mutationResponse.errors.length === 0) {
      console.log("SUCESS");
      console.log(mutationController.data);
      setLoadingState("Idle");
      setSubmissionStatus("SUCCESS");
    } else {
      console.log("ERROR POSTING DATA!!");
      setLoadingState("Idle");
      console.log(mutationController.data);
      console.log(mutationController.error);
      setSubmissionStatus("ERROR");
    }
  }, [mutationController]);

  useEffect(() => {
    if (mutationController.isLoading) {
      setLoadingState("Loading");
      setSubmissionStatus("LOADING");
    }
  }, [mutationController.isLoading]);

  const sendData = () => {
    console.log("ONCLICK");
    mutationController.mutate({
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
