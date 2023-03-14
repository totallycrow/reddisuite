import React from "react";

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
  link: string
) => {
  let isValid = true;

  console.log(
    "@@@@@@@@@@@@@@@@!!!&&&&&&*&*&*&*&*&*&*&(()()()()()()()()[][][][]@@@@@@@@@@@@@@@@!!!&&&&&&*&*&*&*&*&*&*&(()()()()()()()()[][][][]@@@@@@@@@@@@@@@@!!!&&&&&&*&*&*&*&*&*&*&(()()()()()()()()[][][][]"
  );
  console.log(title);
  console.log(isTitleTagRequired);
  console.log(titleTags);
  console.log(link);

  if (!isValidUrl(link)) return false;

  if (isTitleTagRequired) {
    isValid = titleTags.some((tag: string) => title.includes(tag));
    console.log(isValid);
  }

  return isValid;
};
