import React from "react";
import { PostItemInputs } from "./PostItemInputs";
import { usePostItemManager } from "../../../../hooks/controllers/postSubmission/usePostItemManager";
import "react-datetime/css/react-datetime.css";
import type { IMainControllerConfig } from "../mainPostController/MainPostController";
import { PostItemScheduler } from "./PostItemScheduler";
import { PostItemFeedback } from "./PostItemFeedback";
import { CardContainer } from "../../../ui/CardContainer";
import { Spinner } from "../../../ui/Spinner";
import { Divider } from "../../../ui/Divider";
import { SubmitButton } from "../../../ui/SubmitButton";
import { PostItemFlairs } from "./PostItemFlairs";

export const PostItem = (postConfig: IPostFormValues) => {
  const isUpdater = postConfig.controllerConfig.updaterModule;

  const {
    userInput,
    formConfig,
    shouldShowSpinner,
    setPostDate,
    isButtonDisabled,
    mutationUtilities,
    subredditUtils,
    borderColour,
  } = usePostItemManager(postConfig);

  return (
    <div>
      <CardContainer borderColor={borderColour}>
        <h3 className="px-4 pt-4 text-lg font-bold">r/{userInput}</h3>
        <div>{shouldShowSpinner ? <Spinner /> : ""}</div>
        <div data-theme="" className="m-auto flex w-full">
          <div className=""></div>
        </div>
        <PostItemInputs config={formConfig} />

        {/* FLAIR CONTROLLER */}
        <PostItemFlairs
          setFlair={formConfig.setSelectedFlair}
          isFlairRequired={subredditUtils.isFlairRequired}
          flairList={subredditUtils.flairList}
        />

        {/* SCHEDULER */}
        <Divider />
        <PostItemScheduler setPostDate={setPostDate} />

        {/* FORM CONTROLS */}
        <SubmitButton
          isButtonDisabled={isButtonDisabled}
          callback={() => void formConfig.sendData()}
          buttonText={isUpdater ? "Update" : "Submit"}
        />
        {isUpdater && (
          <SubmitButton
            isButtonDisabled={isButtonDisabled}
            callback={postConfig.removal}
            buttonText={"Remove"}
          />
        )}

        {/* RESULT FEEDBACK */}
        <PostItemFeedback
          mutationUtilities={mutationUtilities}
          subredditUtils={subredditUtils}
        />
      </CardContainer>
    </div>
  );
};

// ***************************************************************
// ***************************************************************

export interface IPostFormValues {
  title: string;
  link: string;
  subreddit: string;
  triggerLocalChange: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAnyInputSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  isAnyInputSubmitting: boolean;
  controllerConfig: IMainControllerConfig;
  postId: string;
  removal: () => void;
}

// ***************************************************************
// ***************************************************************
// ***************************************************************
// ***************************************************************
{
  /* DEBUG STATUS PANEL */
}
{
  /* <h1>
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
        </div> */
}
{
  /* DEBUG PANEL */
}
