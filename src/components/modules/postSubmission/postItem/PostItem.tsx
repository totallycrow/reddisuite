import React, { useState } from "react";
import { PostItemInputs } from "./PostItemInputs";
import { usePostItemManager } from "../../../../hooks/controllers/postSubmission/usePostItemManager";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment, { Moment } from "moment";
import { IMainControllerConfig } from "../mainPostController/MainPostController";
import { PostItemControls } from "./PostItemControls";
import { PostItemScheduler } from "./PostItemScheduler";

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

  const isScheduler = postConfig.controllerConfig.schedulerModule;
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
  } = usePostItemManager(postConfig);

  const isSubmittedOK = submissionStatus === "SUCCESS";
  const isLoading = loadingState !== "Idle";

  const isButtonDisabled =
    formConfig.title === "" ||
    formConfig.link === "" ||
    formConfig.userInput === "" ||
    isSubmittedOK ||
    isLoading ||
    formConfig.isSubmitting ||
    !isFormItemValidated.isValid
      ? true
      : false;

  const formItem = formObserver.getFormItemBySubreddit(userInput);

  return (
    <div>
      <h1>
        Is Submitting? :{" "}
        {formObserver.getFormItemBySubreddit(userInput)?.isSubmitting ||
        postConfig.isAnyInputSubmitting
          ? "YES"
          : "NO"}
      </h1>
      <div>Post Date: {postDate}</div>
      <h1>Loading Status: {loadingState}</h1>
      <div>Submission Status: {submissionStatus}</div>
      <div>Validation Status: {isFormItemValidated.isValid ? "YES" : "NO"}</div>
      <div>
        Is Idle:{" "}
        {formObserver &&
        formObserver.getFormItemBySubreddit(userInput) &&
        formObserver.getFormItemBySubreddit(userInput)?.isIdle
          ? "YES"
          : "NO"}
      </div>
      <h3 className="px-4 pt-4 text-lg font-bold">r/{userInput}</h3>
      <div>
        {shouldShowSpinner ? (
          <div className="flex items-center justify-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div data-theme="" className="m-auto flex w-full">
        <div className=""></div>
      </div>
      <PostItemInputs config={formConfig} isButtonDisabled={isButtonDisabled} />
      <div className="flex w-full flex-col">
        <div className="divider"></div>
      </div>
      {/* SCHEDULER */}
      <PostItemScheduler setPostDate={setPostDate} />
      {/* FORM CONTROLS */}
      <PostItemControls />
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
  isScheduler: boolean;
  postId: string;
}
