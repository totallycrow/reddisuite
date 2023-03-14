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
  const { debouncedInput } = useDebouncedSearch(config.userInput, () =>
    Promise.resolve()
  );
  const [subsList, setSubsList] = useState(Array<string>);
  const [clean, setClean] = useState(false);
  const [submissionCalls, setSubmissionCalls] = useState(0);
  const [triggerSubmission, setTriggerSubmission] = useState(false);

  const [userPosts, setUserPosts] = useState([]);
  const formObserver = FormObserver.getInstance();

  //   Listen for change in debouced inputs and split & generate list of subreddits
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
  }, [debouncedInput]);

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
      {/* <div>{submissionCalls}</div> */}
      {/* <SubmitItem
        key={Date.now() + Math.random()}
        title={"test"}
        link={"test"}
        subreddit={""}
      /> */}
      <div>
        <FormInputs inputsConfig={config} />
        <button onClick={() => formObserver.publish()}>submit all</button>
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
                    trigger={triggerSubmission}
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
