import React, { useEffect, useState } from "react";
import { InputItem } from "../../../utils/InputItem";
import { IFormValidationResult } from "../../../../hooks/validation/useFormItemValidation/useFormItemValidation";

interface IPostItemInputsConfig {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  link: string;
  setLink: React.Dispatch<React.SetStateAction<string>>;
  userInput: string;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  subRedditController: any;
  mutationController: any;
  setSelectedFlair: React.Dispatch<React.SetStateAction<string>>;
  sendData: () => Promise<void>;
  submissionStatus: string;
  loadingState: string;
  isFormItemValidated: IFormValidationResult;
  isError: boolean;
  isSubmitting: boolean;
  isAnyInputSubmitting: boolean;
  setIsAnyInputSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

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
    // ?????????????????????????????????????????????????????????????????????????????????????????
    // HOW TO GET THESE TYPES?
    // ?????????????????????????????????????????????????????????????????????????????????????????
    mutationController,
    subRedditController,
    sendData,
    setSelectedFlair,
    submissionStatus,
    loadingState,
    isFormItemValidated,
    isError,
    isSubmitting,
    setIsAnyInputSubmitting,
  } = config;

  const isSubmittedOK = submissionStatus === "SUCCESS";
  const isLoading = loadingState !== "Idle";

  return (
    <div>
      <div
        className={
          isSubmittedOK
            ? "rounded border border-emerald-400 p-4"
            : submissionStatus === "ERROR" || isError
            ? "rounded border border-rose-600 p-4"
            : "rounded border border-slate-800 p-4"
        }
      >
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
        <div>
          {subRedditController.data &&
            subRedditController.data.flairs &&
            subRedditController.data.flairs.length > 0 && (
              <div>
                <p>Flair required:</p>
                <div>
                  <select
                    className="select-bordered select w-full max-w-xs"
                    onChange={(e) => setSelectedFlair(e.target.value)}
                  >
                    {subRedditController.data.flairs.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
        </div>
        <button
          className="btn m-2"
          disabled={
            title === "" ||
            link === "" ||
            userInput === "" ||
            isSubmittedOK ||
            isLoading ||
            isSubmitting ||
            !isFormItemValidated.isValid
              ? true
              : false
          }
          onClick={() => {
            setIsAnyInputSubmitting(true);
            void sendData();
          }}
        >
          Submit
        </button>
      </div>

      <div>{mutationController.isLoading && <p>Loading...</p>}</div>
      <div>
        {mutationController.data &&
          mutationController.data.json &&
          mutationController.data.json.errors.length > 0 && (
            <p>{mutationController.data.json.errors[0][1]}</p>
          )}
      </div>
      <div>
        {mutationController.data && mutationController.data.error && (
          <p>{mutationController.data.message}</p>
        )}
      </div>

      <div>
        {subRedditController.data && subRedditController.data.explanation && (
          <p>{subRedditController.data.explanation}</p>
        )}
      </div>

      <div>
        {subRedditController.data &&
          subRedditController.data.titleTags &&
          subRedditController.data.titleTags.length > 0 && (
            <p>
              Title tag required: &quot;
              {subRedditController.data.titleTags[0]}&quot;
            </p>
          )}
      </div>
      <div></div>
    </div>
  );
};
