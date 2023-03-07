import React, { useEffect, useState } from "react";

export const FormItem = ({ config }) => {
  const {
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
  } = config;

  return (
    <div>
      <div className="p-4">
        <h2 className="p-4">Submit Your Post</h2>
        <div>
          <div>
            Title:{" "}
            <input
              type="text"
              className="border-2 border-gray-800"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            Link:{" "}
            <input
              type="text"
              className="border-2 border-gray-800"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <div>
            Subreddit:{" "}
            <input
              type="text"
              className="border-2 border-gray-800"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>
        </div>
        <button
          disabled={
            title === "" || link === "" || userInput === "" ? true : false
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
