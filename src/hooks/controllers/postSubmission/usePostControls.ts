import { useEffect, useState } from "react";
import { useDebouncedSearch } from "../utils/../../utils/useDebouncedSearch";
import { FormObserver } from "../../../utils/formObserver";
import {
  isTitleValid,
  isValidUrl,
} from "../../validation/useFormItemValidation/utils";

export const usePostControls = (config: IConfig) => {
  const { debouncedInput, debouncedStatus } = useDebouncedSearch(
    config.userInput,
    () => Promise.resolve()
  );

  const formObserver = FormObserver.getInstance();

  const [subsList, setSubsList] = useState(new Set<string>());
  const [clean, setClean] = useState(false);

  // potentially global?
  const [localChangeTriggered, setLocalChangeTriggered] = useState(false);
  const [
    isMainPostControllerFullyValidated,
    setIsMainPostControllerFullyValidated,
  ] = useState(false);

  // potentially redundant? Instead of prop-drilling, get that info from component that needs it
  // potentially global?
  const [isAnySubmitted, setIsAnySubmitted] = useState(
    formObserver.isAnyInputSubmitted()
  );
  // potentially global?
  const [isAnyInputSubmitting, setIsAnyInputSubmitting] = useState(
    formObserver.isAnyInputSubmitting()
  );

  // *********************************************************
  // MANAGING THE LIST OF SUBREDDITS PROVIDED BY USER
  // Listen for change in debouced inputs and split & generate list of subreddits
  // *********************************************************

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

    setClean(true);
    setSubsList(sanitizedSet);
    const status = formObserver.isFullyValidated();
    setIsMainPostControllerFullyValidated(status);
  }, [debouncedInput]);

  // *********************************************************
  // OBSERVING CHANGES IN GENERATED INPUTS FOR SPECIFIED POSTS
  // TWO TYPES OF CHANGES: POST DATA & SUBMISSION STATUS / INPUT VALUES CHANGE
  // *********************************************************

  useEffect(() => {
    setLocalChangeTriggered(false);
    setIsAnySubmitted(formObserver.isAnyInputSubmitted());
    setIsAnyInputSubmitting(formObserver.isAnyInputSubmitting());
    const status = formObserver.isFullyValidated();

    setIsMainPostControllerFullyValidated(status);
  }, [localChangeTriggered]);

  // *********************************************************

  const isTitleValidated = isTitleValid(config.title);
  const isLinkValidated = isValidUrl(config.link);
  const isSubListValidated = subsList.size > 0;

  // *********************************************************

  const publish = () => {
    setIsAnyInputSubmitting(true);
    void formObserver.publish();
  };

  const shouldDisplayList =
    subsList.size > 0 && clean && isLinkValidated && isTitleValidated;

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
    publish,
    shouldDisplayList,
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
