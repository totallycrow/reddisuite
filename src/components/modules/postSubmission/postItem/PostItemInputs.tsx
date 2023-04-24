import React from "react";
import { InputItem } from "../../../ui/InputItem";
import type { IFormValidationResult } from "../../../../hooks/validation/useFormItemValidation/useFormItemValidation";

export const PostItemInputs = ({
  config,
}: {
  config: IPostItemInputsConfig;
}) => {
  const {
    title,
    setTitle,
    link,
    setLink,
    userInput,
    setUserInput,
    submissionStatus,
    loadingState,
    isFormItemValidated,
    postDate,
  } = config;

  const isSubmittedOK = submissionStatus === "SUCCESS";
  const isLoading = loadingState !== "Idle";

  return (
    <div>
      Date: {postDate}
      <h2 className="p-4">Submit Your Post to: r/{userInput}</h2>
      <div>{isSubmittedOK ? <div>SUBMITTED SUCESSFULLY!</div> : ""}</div>
      <div>
        <InputItem
          title={"Post Title"}
          key="title"
          value={title}
          type="text"
          placeholder="Enter your post title here..."
          callback={setTitle}
          disabled={isSubmittedOK || isLoading}
          isValid={isFormItemValidated.titleValid}
          label=""
        />

        <InputItem
          title={"Link URL"}
          key="link"
          value={link}
          type="text"
          placeholder="Enter your image URL here..."
          callback={setLink}
          disabled={isSubmittedOK || isLoading}
          isValid={isFormItemValidated.linkValid}
          label=""
        />

        <InputItem
          title={"Subreddit"}
          key="subreddit"
          value={userInput}
          type="text"
          placeholder="Enter your subreddit name here..."
          callback={setUserInput}
          disabled={true}
          label=""
          isValid={true}
        />
      </div>
      <div></div>
    </div>
  );
};

export interface IPostItemInputsConfig {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  link: string;
  setLink: React.Dispatch<React.SetStateAction<string>>;
  userInput: string;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  submissionStatus: string;
  loadingState: string;
  isFormItemValidated: IFormValidationResult;
  postDate: number;
}
