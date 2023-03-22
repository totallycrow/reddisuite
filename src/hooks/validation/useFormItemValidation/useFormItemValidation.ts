import React, { useMemo } from "react";
import { IFormItem } from "../../../utils/formObserver";
import { IError } from "../../controllers/postSubmission/useFlairController";
import { IFullSubredditData, ISubredditError } from "../../../services/reddit";
import { isValidUrl } from "./utils";

function isISubredditError(
  data: IFullSubredditData | ISubredditError | IError
): data is ISubredditError | IError {
  const isSubredditError = (data as ISubredditError).message !== undefined;
  const isIError = (data as IError).error !== undefined;

  return isSubredditError || isIError;
}

export interface IFormValidationResult {
  isValid: boolean;
  titleValid: boolean;
  linkValid: boolean;
}

export const useFormItemValidation = (
  title: string,
  isTitleTagRequired: boolean | undefined,
  titleTags: Array<string> | undefined,
  link: string,
  loadingState: string,
  subdata: IFullSubredditData | ISubredditError | { error: string },
  partial: boolean
) => {
  const formValidationResult = useMemo(() => {
    return {
      isValid: false,
      titleValid: false,
      linkValid: false,
    };
  }, [title, isTitleTagRequired, titleTags, link, subdata]);

  if (!partial && !subdata) return formValidationResult;

  if (!partial && isISubredditError(subdata)) return formValidationResult;

  if (isValidUrl(link)) {
    formValidationResult.linkValid = true;
  }

  console.log(title);
  if (title.length > 0 && title !== "") formValidationResult.titleValid = true;

  console.log("TT=UTLE");
  console.log(title);

  if (isTitleTagRequired && !titleTags) {
    formValidationResult.titleValid = false;
  }

  if (isTitleTagRequired && titleTags) {
    console.log("TITLE REQUIRED");

    if (!titleTags) {
      formValidationResult.titleValid = false;
    }

    const isTitleValid = titleTags.some((tag: string) => title.includes(tag));
    // console.log(isValid);
    // return isValid;
    formValidationResult.titleValid = isTitleValid;
  }

  if (formValidationResult.linkValid && formValidationResult.titleValid) {
    formValidationResult.isValid = true;
  }

  // ????
  if (loadingState !== "Idle") {
    formValidationResult.isValid = false;
  }

  console.log(formValidationResult);

  return formValidationResult;
};
