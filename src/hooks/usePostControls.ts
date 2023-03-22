import React, { useEffect, useState } from "react";
import { useDebouncedSearch } from "./useDebouncedSearch";
import { FormObserver } from "../utils/formObserver";
import { useFormItemValidation } from "./useFormItemValidation/useFormItemValidation";
import { isTitleValid, isValidUrl } from "./useFormItemValidation/utils";

export const usePostControls = (config: IConfig) => {
  // ***************************************************************************
  // ***************************************************************************

  const { debouncedInput, debouncedStatus } = useDebouncedSearch(
    config.userInput,
    () => Promise.resolve()
  );

  const formObserver = FormObserver.getInstance();

  const [subsList, setSubsList] = useState(Array<string>);
  const [clean, setClean] = useState(false);
  const [localChangeTriggered, setLocalChangeTriggered] = useState(false);
  const [
    isMainPostControllerFullyValidated,
    setIsMainPostControllerFullyValidated,
  ] = useState(false);

  const [isAnySubmitted, setIsAnySubmitted] = useState(
    formObserver.isAnyInputSubmitted()
  );
  const [isAnyInputSubmitting, setIsAnyInputSubmitting] = useState(
    formObserver.isAnyInputSubmitting()
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

    setIsMainPostControllerFullyValidated(status);
  }, [debouncedInput]);

  useEffect(() => {
    setLocalChangeTriggered(false);
    setIsAnySubmitted(formObserver.isAnyInputSubmitted());
    setIsAnyInputSubmitting(formObserver.isAnyInputSubmitting());
    const status = formObserver.isFullyValidated();

    setIsMainPostControllerFullyValidated(status);
  }, [localChangeTriggered]);

  useEffect(() => {
    setClean(false);
    setIsMainPostControllerFullyValidated(false);
    const status = formObserver.isFullyValidated();
    setIsMainPostControllerFullyValidated(status);
    formObserver.cleanSubscribers();
  }, [config.userInput]);

  const isTitleValidated = isTitleValid(config.title);
  const isLinkValidated = isValidUrl(config.link);

  return {
    isMainPostControllerFullyValidated,
    isAnySubmitted,
    debouncedStatus,
    subsList,
    clean,
    isTitleValidated,
    isLinkValidated,
    setLocalChangeTriggered,
    isAnyInputSubmitting,
    setIsAnyInputSubmitting,
  };
};

// ***************************************************************************
// ***************************************************************************
// ***************************************************************************

export interface IConfig {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  link: string;
  setLink: React.Dispatch<React.SetStateAction<string>>;
  userInput: string;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
}
