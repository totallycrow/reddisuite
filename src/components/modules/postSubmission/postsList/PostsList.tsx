import React from "react";
import { PostItem } from "../postItem/PostItem";
import {
  IMainControllerConfig,
  ITitleLinkSublistValidation,
} from "../mainPostController/MainPostController";
import { IConfig } from "../../../../hooks/controllers/postSubmission/usePostControls";

export const PostsList = ({
  subsList,
  config,
  setLocalChangeTriggered,
  isAnyInputSubmitting,
  setIsAnyInputSubmitting,
  isMainPostControllerFullyValidated,
  debouncedStatus,
  isAnySubmitted,
  publish,
  controllerConfig,
}: {
  subsList: Set<string>;
  config: IConfig;
  setLocalChangeTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  isAnyInputSubmitting: boolean;
  setIsAnyInputSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  isMainPostControllerFullyValidated: boolean;
  debouncedStatus: string;
  isAnySubmitted: boolean;
  publish: () => void;
  controllerConfig: IMainControllerConfig;
}) => {
  // useFormState
  // const disabled =
  return (
    <div>
      <div>
        {([...subsList] as Array<string>).map((sub) => {
          return (
            <PostItem
              key={sub}
              title={config.title}
              link={config.link}
              subreddit={sub}
              triggerLocalChange={setLocalChangeTriggered}
              isAnyInputSubmitting={isAnyInputSubmitting}
              setIsAnyInputSubmitting={setIsAnyInputSubmitting}
              controllerConfig={controllerConfig}
              postId={""}
              removal={() => ""}
            />
          );
        })}
      </div>

      {(isAnySubmitted || !isMainPostControllerFullyValidated) &&
      config.title !== "" &&
      config.link !== "" &&
      subsList.size !== 0 &&
      debouncedStatus !== "Loading..." ? (
        <p>
          Cannot submit all post at once because of errors in validation or
          posts have already been submitted.
        </p>
      ) : (
        ""
      )}
      <button
        className="btn mb-10 w-full"
        disabled={
          isAnySubmitted ||
          !isMainPostControllerFullyValidated ||
          debouncedStatus === "Loading..." ||
          isAnyInputSubmitting
        }
        onClick={() => publish()}
      >
        submit all
      </button>
    </div>
  );
};
