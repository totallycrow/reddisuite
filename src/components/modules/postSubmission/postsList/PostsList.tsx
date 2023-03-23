import React from "react";
import { PostItem } from "../postItem/PostItem";

export const PostsList = ({
  subsList,
  clean,
  validation,
  config,
  setLocalChangeTriggered,
  isAnyInputSubmitting,
  setIsAnyInputSubmitting,
  isMainPostControllerFullyValidated,
  debouncedStatus,
  isAnySubmitted,
  publish,
}) => {
  return (
    <div>
      <div>
        {subsList.size > 0 &&
        clean &&
        validation.isLinkValidated &&
        validation.isTitleValidated
          ? ([...subsList] as Array<string>).map((sub) => {
              return (
                <PostItem
                  key={sub}
                  title={config.title}
                  link={config.link}
                  subreddit={sub}
                  triggerLocalChange={setLocalChangeTriggered}
                  isAnyInputSubmitting={isAnyInputSubmitting}
                  setIsAnyInputSubmitting={setIsAnyInputSubmitting}
                />
              );
            })
          : ""}
      </div>

      {/* *************** */}
      {/* *************** */}

      {/* *************** */}

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
