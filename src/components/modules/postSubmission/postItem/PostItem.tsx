import React, { useEffect, useState } from "react";
import { PostItemInputs } from "./PostItemInputs";
import { usePostItemManager } from "../../../../hooks/controllers/postSubmission/usePostItemManager";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment, { Moment } from "moment";
import { IMainControllerConfig } from "../mainPostController/MainPostController";
import { PostItemControls } from "./PostItemControls";
import { PostItemScheduler } from "./PostItemScheduler";
import { PostItemFeedback } from "./PostItemFeedback";
import { CardContainer } from "../../../ui/CardContainer";
import { Spinner } from "../../../ui/Spinner";
import { Divider } from "../../../ui/Divider";
import { SubmitButton } from "../../../ui/SubmitButton";

export const PostItem = (postConfig: IPostFormValues) => {
  // PostItem = logic
  // v
  // define variables
  // building blocks:
  // header
  // inputs
  // scheduler
  // postItemControls
  // button [submit / update || delete]
  // check form status -> disable update if form hasn't changed

  const isUpdater = postConfig.isUpdater;
  const {
    formObserver,
    userInput,
    loadingState,
    submissionStatus,
    formConfig,
    isFormItemValidated,
    shouldShowSpinner,
    postDate,
    setPostDate,
    isButtonDisabled,
    formItem,
    mutationUtilities,
    subredditUtils,
  } = usePostItemManager(postConfig);

  const [borderColour, setBorderColour] = useState("default");

  const isSubmittedOK = submissionStatus === "SUCCESS";
  const isLoading = loadingState !== "Idle";

  useEffect(() => {
    const border = isSubmittedOK
      ? "green"
      : submissionStatus === "ERROR" || formConfig.isError
      ? "red"
      : "default";
    setBorderColour(border);
  }, [isSubmittedOK, isLoading, formConfig.isError, submissionStatus]);

  return (
    <div>
      <CardContainer borderColor={borderColour}>
        {/* DEBUG STATUS PANEL */}
        {/* <h1>
          Is Submitting? :{" "}
          {formItem?.isSubmitting || postConfig.isAnyInputSubmitting
            ? "YES"
            : "NO"}
        </h1>
        <div>Post Date: {postDate}</div>
        <h1>Loading Status: {loadingState}</h1>
        <div>Submission Status: {submissionStatus}</div>
        <div>
          Validation Status: {isFormItemValidated.isValid ? "YES" : "NO"}
        </div>
        <div>
          Is Idle:{" "}
          {formObserver &&
          formObserver.getFormItemBySubreddit(userInput) &&
          formObserver.getFormItemBySubreddit(userInput)?.isIdle
            ? "YES"
            : "NO"}
        </div> */}
        {/* DEBUG PANEL */}
        <h3 className="px-4 pt-4 text-lg font-bold">r/{userInput}</h3>
        <div>{shouldShowSpinner ? <Spinner /> : ""}</div>
        <div data-theme="" className="m-auto flex w-full">
          <div className=""></div>
        </div>
        <PostItemInputs
          config={formConfig}
          isButtonDisabled={isButtonDisabled}
        />

        {/* SCHEDULER */}
        <Divider />
        <PostItemScheduler setPostDate={setPostDate} />

        {/* FORM CONTROLS */}
        {/* <PostItemControls /> */}
        <SubmitButton
          isButtonDisabled={isButtonDisabled}
          callback={formConfig.sendData}
          buttonText={isUpdater ? "Update" : "Submit"}
        />
        {isUpdater && (
          <SubmitButton
            isButtonDisabled={isButtonDisabled}
            callback={postConfig.removal}
            buttonText={"Remove"}
          />
        )}

        <PostItemFeedback
          mutationUtilities={mutationUtilities}
          subredditUtils={subredditUtils}
        />
      </CardContainer>
    </div>
  );
};

export interface IPostFormValues {
  title: string;
  link: string;
  subreddit: string;
  triggerLocalChange: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAnyInputSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  isAnyInputSubmitting: boolean;
  controllerConfig: IMainControllerConfig;
  isUpdater: boolean;
  postId: string;
  removal: () => void;
}
