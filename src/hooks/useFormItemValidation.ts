import React from "react";
import { IFormItem } from "../utils/formObserver";
import { IError } from "./useFlairController";
import { IFullSubredditData, ISubredditError } from "../services/reddit";

const urlPattern = new RegExp(
  "(?:https?)://(w+:?w*)?(S+)(:d+)?(/|/([w#!:.?+=&%!-/]))?"
);

const isValidUrl = (urlString: string) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

export const useFormItemValidation = (
  title: string,
  isTitleTagRequired: boolean | undefined,
  titleTags: Array<any>,
  link: string,
  loadingState: string,
  subdata: IFullSubredditData | ISubredditError
) => {
  let isValid = false;

  console.log(
    "@@@@@@@@@@@@@@@@!!!&&&&&&*&*&*&*&*&*&*&(()()()()()()()()[][][][]@@@@@@@@@@@@@@@@!!!&&&&&&*&*&*&*&*&*&*&(()()()()()()()()[][][][]@@@@@@@@@@@@@@@@!!!&&&&&&*&*&*&*&*&*&*&(()()()()()()()()[][][][]"
  );
  console.log(title);
  console.log(isTitleTagRequired);
  console.log(titleTags);
  console.log(link);
  console.log(loadingState);

  function isISubredditError(
    data: IFullSubredditData | ISubredditError | IError
  ): data is ISubredditError | IError {
    const isSubredditError = (data as ISubredditError).message !== undefined;
    const isIError = (data as IError).error !== undefined;

    return isSubredditError || isIError;
  }

  if (isISubredditError(subdata)) return false;

  if (!isValidUrl(link)) {
    return false;
  }

  if (loadingState !== "Idle") return false;

  if (isTitleTagRequired) {
    console.log("TITLE REQUIRED");
    isValid = titleTags.some((tag: string) => title.includes(tag));
    console.log(isValid);
    return isValid;
  }

  console.log("VALIDATION ENDS RESULT");
  console.log(isValid);

  return true;
};
