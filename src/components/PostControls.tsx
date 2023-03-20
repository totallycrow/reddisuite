import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitItem } from "./submitItem/SubmitItem";
import { useFormController } from "../hooks/useFormController";
import { FormInputs } from "./FormInputs";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";
import { FormObserver } from "../utils/formObserver";
import { useFormItemValidation } from "../hooks/useFormItemValidation";

export const PostControls = () => {
  const config = useFormController();
  const formObserver = FormObserver.getInstance();

  const { debouncedInput, debouncedStatus } = useDebouncedSearch(
    config.userInput,
    () => Promise.resolve()
  );
  const [subsList, setSubsList] = useState(Array<string>);
  const [clean, setClean] = useState(false);
  const [localChangeTriggered, setLocalChangeTriggered] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isAnySubmitted, setIsAnySubmitted] = useState(
    formObserver.isAnyInputSubmitted()
  );

  //   Listen for change in debouced inputs and split & generate list of subreddits
  useEffect(() => {
    if (debouncedInput === "") return;
    if (!debouncedInput.includes(",")) {
      setClean(true);
      setSubsList([debouncedInput]);
      return;
    }

    const list = debouncedInput.split(",");

    const sanitizedList = list.map((splitSub: string) => {
      return splitSub.trim();
    });

    setClean(true);
    setSubsList(sanitizedList);
    const status = formObserver.isFullyValidated();

    setValidated(status);
  }, [debouncedInput]);

  useEffect(() => {
    setLocalChangeTriggered(false);
    setIsAnySubmitted(formObserver.isAnyInputSubmitted());
    const status = formObserver.isFullyValidated();

    setValidated(status);
  }, [localChangeTriggered]);

  useEffect(() => {
    setClean(false);
    setValidated(false);
    const status = formObserver.isFullyValidated();
    setValidated(status);
    formObserver.cleanSubscribers();
  }, [config.userInput]);

  const validate = useFormItemValidation(
    config.title,
    false,
    [],
    config.link,
    "",
    undefined,
    true
  );

  return (
    <div>
      <h1>Setup Your Post</h1>
      <div>Are all validated? {validated ? "YES" : "NO"}</div>

      <div>
        <FormInputs inputsConfig={config} validation={validate} />
        <button
          className="btn m-2"
          disabled={isAnySubmitted || !validated}
          onClick={() => formObserver.publish()}
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
            <div class="flex items-center justify-center">
              <div
                class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>

        <div>
          {subsList.length > 0 && clean
            ? subsList.map((sub, index) => {
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
