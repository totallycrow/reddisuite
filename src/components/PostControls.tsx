import React, { useMemo } from "react";
import { SubmitItem } from "./submitItem/SubmitItem";
import { useFormController } from "../hooks/useFormController";
import { FormInputs } from "./FormInputs";
import { FormObserver } from "../utils/formObserver";
import { usePostControls } from "../hooks/usePostControls";

export const PostControls = () => {
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
        <FormInputs inputsConfig={config} validation={validation} />
        <button
          className="btn m-2"
          disabled={isAnySubmitted || !isMainPostControllerFullyValidated}
          onClick={() => void formObserver.publish()}
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
                  <SubmitItem
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
    </div>
  );
};
