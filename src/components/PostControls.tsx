import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitItem } from "./submitItem/SubmitItem";
import { useFormController } from "../hooks/useFormController";
import { FormInputs } from "./FormInputs";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";
import { create } from "zustand";
import useBearStore from "../store/useBearStore";
import { FormObserver } from "../utils/formObserver";

export const PostControls = () => {
  const config = useFormController();
  const formObserver = FormObserver.getInstance();

  const { debouncedInput } = useDebouncedSearch(config.userInput, () =>
    Promise.resolve()
  );
  const [subsList, setSubsList] = useState(Array<string>);
  const [clean, setClean] = useState(false);
  const [submissionCalls, setSubmissionCalls] = useState(0);
  const [triggerSubmission, setTriggerSubmission] = useState(false);
  const [localChangeTriggered, setLocalChangeTriggered] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isAnySubmitted, setIsAnySubmitted] = useState(
    formObserver.isAnyInputSubmitted()
  );

  // const formObserver = FormObserver.getInstance();

  //   Listen for change in debouced inputs and split & generate list of subreddits
  // const validated = formObserver.isFullyValidated();
  useEffect(() => {
    console.log(debouncedInput);

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
    console.log(status);
    setValidated(status);
  }, [debouncedInput]);

  useEffect(() => {
    console.log(
      "&&&&&&&&&&&&&&&&&&^%%%%%%%%%%%%%%%%%%%%%%%&&&&&&&&&&&&&&&&&&^%%%%%%%%%%%%%%%%%%%%%%%&&&&&&&&&&&&&&&&&&^%%%%%%%%%%%%%%%%%%%%%%%&&&&&&&&&&&&&&&&&&^%%%%%%%%%%%%%%%%%%%%%%%&&&&&&&&&&&&&&&&&&^%%%%%%%%%%%%%%%%%%%%%%%&&&&&&&&&&&&&&&&&&^%%%%%%%%%%%%%%%%%%%%%%%&&&&&&&&&&&&&&&&&&^%%%%%%%%%%%%%%%%%%%%%%%&&&&&&&&&&&&&&&&&&^%%%%%%%%%%%%%%%%%%%%%%%"
    );
    console.log("LOCAL CHANGE FIRED");

    setLocalChangeTriggered(false);
    setIsAnySubmitted(formObserver.isAnyInputSubmitted());
    const status = formObserver.isFullyValidated();
    console.log(status);
    setValidated(status);
  }, [localChangeTriggered]);

  //   Listen for change in sub lists

  useEffect(() => {
    ("");
  }, [subsList]);

  console.log(config.userInput);

  console.log("SUBS LIST");
  console.log(subsList);
  console.log(clean);

  useEffect(() => {
    console.log("USER INPUT FIRED");
    console.log(
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    );
    console.log(config.userInput);
    setClean(false);
    setValidated(false);
    const status = formObserver.isFullyValidated();
    console.log(status);
    setValidated(status);
    formObserver.cleanSubscribers();
  }, [config.userInput]);

  //   useEffect(() => {
  //     console.log(
  //       "XXXX000000___+_+_+_+_+_+_+_+_+_+_+_++_ SUBMISSION CALLS CHANGED"
  //     );
  //     console.log(submissionCalls);
  //   }, [submissionCalls]);

  return (
    <div>
      {/* <div>{bears}</div> */}
      <h1>Setup Your Post</h1>
      <div>Are all validated? {validated ? "YES" : "NO"}</div>
      {/* <div>{submissionCalls}</div> */}
      {/* <SubmitItem
        key={Date.now() + Math.random()}
        title={"test"}
        link={"test"}
        subreddit={""}
      /> */}
      <div>
        <FormInputs inputsConfig={config} />
        <button
          disabled={isAnySubmitted || !validated}
          onClick={() => formObserver.publish()}
        >
          submit all
        </button>
        <button
          onClick={() => {
            console.log(formObserver.getFormItems());
          }}
        >
          log form items
        </button>
        <div>Submission Details</div>

        <div>
          {subsList.length > 0 && clean
            ? subsList.map((sub, index) => {
                console.log("SUB MAP");
                console.log(sub);

                return (
                  <SubmitItem
                    key={sub}
                    title={config.title}
                    link={config.link}
                    subreddit={sub}
                    trigger={setLocalChangeTriggered}
                    setTrigger={setTriggerSubmission}
                    callback={setSubmissionCalls}
                  />
                );
              })
            : ""}
        </div>
      </div>
    </div>
  );
};
