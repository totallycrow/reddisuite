import React, { useEffect, useState } from "react";
import { useDebouncedSearch } from "../utils/../../utils/useDebouncedSearch";
import { FormObserver } from "../../../utils/formObserver";
import { useFormItemValidation } from "../../validation/useFormItemValidation/useFormItemValidation";
import {
  isTitleValid,
  isValidUrl,
} from "../../validation/useFormItemValidation/utils";

export const usePostControls = (config: IConfig) => {
  // ***************************************************************************
  // ***************************************************************************

  const { debouncedInput, debouncedStatus } = useDebouncedSearch(
    config.userInput,
    () => Promise.resolve()
  );

  const formObserver = FormObserver.getInstance();

  const [subsList, setSubsList] = useState(new Set<string>());
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

  // useEffect(() => {}, []);

  //   Listen for change in debouced inputs and split & generate list of subreddits
  useEffect(() => {
    if (debouncedInput === "") {
      setSubsList(new Set());
      return;
    }
    if (!debouncedInput.includes(",")) {
      setClean(true);

      const initialList = new Set<string>();
      initialList.add(debouncedInput);

      setSubsList(initialList);
      return;
    }

    const userList = debouncedInput.split(",");
    const sanitizedSet = new Set<string>();

    userList.forEach((item: string) => {
      sanitizedSet.add(item);
    });

    // const sanitizedList = new Set(
    //   list.map((splitSub: string) => {
    //     return splitSub.trim();
    //   })
    // );

    setClean(true);
    setSubsList(sanitizedSet);
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
  const isSubListValidated = subsList.size > 0;

  return {
    isMainPostControllerFullyValidated,
    isAnySubmitted,
    debouncedStatus,
    subsList,
    clean,
    isTitleValidated,
    isLinkValidated,
    isSubListValidated,
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
