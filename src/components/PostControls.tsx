import React, { useCallback, useEffect, useState } from "react";
import { SubmitItem } from "./submitItem/SubmitItem";
import { useFormController } from "../hooks/useFormController";
import { FormInputs } from "./FormInputs";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";

export const PostControls = () => {
  const config = useFormController();
  const { debouncedInput } = useDebouncedSearch(config.userInput, () =>
    Promise.resolve()
  );
  const [subsList, setSubsList] = useState(Array<string>);
  const [clean, setClean] = useState(false);
  const [submissionCalls, setSubmissionCalls] = useState(Array<any>);
  const [triggerSubmission, setTriggerSubmission] = useState(false);

  //   Listen for change in debouced inputs and split & generate list of subreddits
  useEffect(() => {
    console.log(debouncedInput);

    if (debouncedInput === "") return;
    if (!debouncedInput.includes(",")) {
      //   setClean(true);
      setSubsList([debouncedInput]);
      return;
    }

    const list = debouncedInput.split(",");

    const sanitizedList = list.map((splitSub: string) => {
      return splitSub.trim();
    });

    // setClean(true);
    setSubsList(sanitizedList);
  }, [debouncedInput]);

  //   Listen for change in sub lists

  useEffect(() => {
    console.log("SUBS LIST CHANGED");
    console.log(subsList);
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
      <h1>Setup Your Post</h1>
      {/* <SubmitItem
        key={Date.now() + Math.random()}
        title={"test"}
        link={"test"}
        subreddit={""}
      /> */}
      <div>
        <FormInputs inputsConfig={config} />
        <div>Submission Details</div>

        <div>
          {subsList.length > 0
            ? subsList.map((sub) => {
                console.log("SUB MAP");
                console.log(sub);

                return (
                  <SubmitItem
                    key={Date.now() + Math.random()}
                    title={config.title}
                    link={config.link}
                    subreddit={sub}
                  />
                );
              })
            : ""}
        </div>
      </div>
    </div>
  );
};
