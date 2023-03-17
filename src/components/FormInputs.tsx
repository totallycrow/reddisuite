import React from "react";
import { InputItem } from "./InputItem";

export const FormInputs = ({ inputsConfig }) => {
  const { setTitle, setLink, setUserInput, title, link, userInput } =
    inputsConfig;

  return (
    <div>
      <div className="form-control">
        <h2 className="p-4">Bulk Subreddits Submission</h2>
        <InputItem
          title={"Post Title"}
          label="Insert a title of your post. Warning: some subreddits might require tags such as [m] or [f]."
          value={title}
          type="text"
          placeholder="Enter your image title here..."
          callback={setTitle}
        />
        {/*  */}
        {/* <label className="label"></label>
        <label className="input-group">
          <span className="w-32">Link URL</span>
          <input
            type="text"
            placeholder="Enter your image link here..."
            className="input-bordered input"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </label> */}
        <InputItem
          title={"Link URL"}
          label="Insert a URL of your image. Warning: some subreddits require a specific host (IMGUR preferred)"
          value={link}
          type="text"
          placeholder="Enter your image link here..."
          callback={setLink}
        />
        {/*  */}

        {/* <label className="label inline">
          Enter a comma-separated list of subreddits, ie
          "askUK,gaming,photography"
        </label>
        <label className="input-group">
          <span className="w-32">Subreddit</span>
          <input
            type="text"
            placeholder="Enter subreddit name title here..."
            className="input-bordered input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </label> */}

        <InputItem
          title={"Subreddit"}
          label={`Enter a comma-separated list of subreddits. Example format: "askUK,gaming,photography"`}
          value={userInput}
          type="text"
          placeholder="Enter your image link here..."
          callback={setUserInput}
        />
      </div>

      {/*  */}
      {/* <div className="p-4">
        <h2 className="p-4">Submit Your Post</h2>
        <div className="">
          <div>
            Title:{" "}
            <input
              type="text"
              placeholder="Enter your image title here..."
              className="input-bordered input m-1 w-full max-w-xs p-1"
              // className="border-2 border-gray-800"

              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            Link:{" "}
            <input
              type="text"
              placeholder="Enter your image link here..."
              className="input-bordered input m-1 w-full max-w-xs p-1"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <div>
            Subreddit:{" "}
            <input
              type="text"
              placeholder="Enter subreddit name title here..."
              className="m-2w-full input-bordered input m-1 max-w-xs p-1"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>
        </div>
      </div> */}
      {/*  */}
    </div>
  );
};
