import React, { useEffect, useState } from "react";
import useBearStore from "../store/useBearStore";
import { InputItem } from "./InputItem";

export const FormItem = ({ config }) => {
  let {
    title,
    setTitle,
    link,
    setLink,
    userInput,
    setUserInput,
    mutationController,
    subRedditController,
    sendData,
    setSelectedFlair,
    renderTitle,
    renderLink,
    renderUserInput,
    submissionStatus,
    loadingState,
    isFormItemValidated,
    isError,
  } = config;

  // const bears = useBearStore((state) => state.bears);
  // const increasePopulation = useBearStore((state) => state.increasePopulation);

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
        {/* <div>{bears}</div> */}
        {/* <button onClick={increasePopulation}>add</button> */}
        <h2 className="p-4">Submit Your Post to: r/{userInput}</h2>
        <div>{isSubmittedOK ? <div>SUBMITTED SUCESSFULLY!</div> : ""}</div>

        <div>
          {/* <div>
            Title:{" "}
            <input
              type="text"
              className="border-2 border-gray-800"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmittedOK || isLoading}
            />
          </div> */}
          <InputItem
            title={"Post Title"}
            value={title}
            type="text"
            placeholder="Enter your image title here..."
            callback={setTitle}
            disabled={isSubmittedOK || isLoading}
            isValid={isFormItemValidated.titleValid}
          />
          {/* <div>
            Link:{" "}
            <input
              type="text"
              className="border-2 border-gray-800"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              disabled={isSubmittedOK || isLoading}
            />
          </div> */}

          <InputItem
            title={"Link URL"}
            value={link}
            type="text"
            placeholder="Enter your image title here..."
            callback={setLink}
            disabled={isSubmittedOK || isLoading}
            isValid={isFormItemValidated.linkValid}
          />
          {/* <div>
            Subreddit:{" "}
            <input
              type="text"
              className="border-2 border-gray-800"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={true}
            />
          </div> */}
          <InputItem
            title={"Subreddit"}
            value={userInput}
            type="text"
            placeholder="Enter your subreddit name here..."
            callback={setUserInput}
            disabled={true}
          />
        </div>
        <button
          className="btn m-2"
          disabled={
            title === "" ||
            link === "" ||
            userInput === "" ||
            isSubmittedOK ||
            isLoading ||
            !isFormItemValidated.isValid
              ? true
              : false
          }
          onClick={() => void sendData()}
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
                    <option value={item.id}>{item.text}</option>
                  ))}
                </select>
              </div>
            </div>
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

      {/*  */}
      {/*  */}
      {/*  */}
      <div></div>
    </div>
  );
};
