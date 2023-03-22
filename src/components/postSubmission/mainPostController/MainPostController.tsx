import React, { useMemo } from "react";
import { PostItem } from "../postItem/PostItem";
import { useFormController } from "../../../hooks/useFormController";
import { MainPostControllerInputs } from "./MainPostControllerInputs";
import { FormObserver } from "../../../utils/formObserver";
import { usePostControls } from "../../../hooks/usePostControls";

export type ITitleLinkValidation = {
  isTitleValidated: boolean;
  isLinkValidated: boolean;
};

export const MainPostController = () => {
  const config = useFormController();
  const formObserver = FormObserver.getInstance();

  const {
    isMainPostControllerFullyValidated,
    isAnySubmitted,
    debouncedStatus,
    subsList,
    clean,
    isLinkValidated,
    isTitleValidated,
    setLocalChangeTriggered,
    isAnyInputSubmitting,
    setIsAnyInputSubmitting,
  } = usePostControls(config);

  const validation = useMemo(() => {
    return {
      isTitleValidated: isTitleValidated,
      isLinkValidated: isLinkValidated,
    };
  }, [isTitleValidated, isLinkValidated]);

  return (
    <div>
      <h1>Setup Your Post</h1>
      <div>
        Are all validated? {isMainPostControllerFullyValidated ? "YES" : "NO"}
      </div>

      <div>
        <MainPostControllerInputs
          inputsConfig={config}
          validation={validation}
        />
        <button
          className="btn m-2"
          disabled={
            isAnySubmitted ||
            !isMainPostControllerFullyValidated ||
            debouncedStatus === "Loading..." ||
            isAnyInputSubmitting
          }
          onClick={() => {
            setIsAnyInputSubmitting(true);
            void formObserver.publish();
          }}
        >
          submit all
        </button>
        <button
          className="btn m-2"
          onClick={() => {
            console.log(formObserver.getFormItems());
          }}
        >
          log form items
        </button>
        <div>
          <h3 className="px-4 pt-4 text-lg font-bold">Your Submissions</h3>
        </div>
        <div className="flex w-full flex-col">
          <div className="divider"></div>
        </div>
        <div>
          {debouncedStatus === "Loading..." ? (
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

        <div>
          {subsList.length > 0 &&
          clean &&
          validation.isLinkValidated &&
          validation.isTitleValidated
            ? subsList.map((sub) => {
                return (
                  <PostItem
                    key={sub}
                    title={config.title}
                    link={config.link}
                    subreddit={sub}
                    triggerLocalChange={setLocalChangeTriggered}
                  />
                );
              })
            : ""}
        </div>
      </div>
      {(isAnySubmitted || !isMainPostControllerFullyValidated) &&
      config.title !== "" &&
      config.link !== "" &&
      subsList.length !== 0 &&
      debouncedStatus !== "Loading..." ? (
        <p>Cannot submit all post at once because of errors in validation.</p>
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
        onClick={() => {
          setIsAnyInputSubmitting(true);
          void formObserver.publish();
        }}
      >
        submit all
      </button>
    </div>
  );
};
