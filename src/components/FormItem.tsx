import React, { useEffect, useState } from "react";
import useBearStore from "../store/useBearStore";

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
  } = config;

  // const bears = useBearStore((state) => state.bears);
  const increasePopulation = useBearStore((state) => state.increasePopulation);

  const isSubmittedOK = submissionStatus === "SUCCESS";
  const isLoading = loadingState !== "Idle";

  return (
    <div>
      <div className="p-4">
        {/* <div>{bears}</div> */}
        {/* <button onClick={increasePopulation}>add</button> */}
        <h2 className="p-4">Submit Your Post</h2>
        <div>{isSubmittedOK ? <div>SUBMITTED SUCESSFULLY!</div> : ""}</div>

        <div>
          <div>
            Title:{" "}
            <input
              type="text"
              className="border-2 border-gray-800"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmittedOK || isLoading}
            />
          </div>
          <div>
            Link:{" "}
            <input
              type="text"
              className="border-2 border-gray-800"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              disabled={isSubmittedOK || isLoading}
            />
          </div>
          <div>
            Subreddit:{" "}
            <input
              type="text"
              className="border-2 border-gray-800"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isSubmittedOK || isLoading}
            />
          </div>
        </div>
        <button
          disabled={
            title === "" ||
            link === "" ||
            userInput === "" ||
            isSubmittedOK ||
            isLoading
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
                <select onChange={(e) => setSelectedFlair(e.target.value)}>
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
