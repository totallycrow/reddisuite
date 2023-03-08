import React from "react";

export const FormInputs = ({ inputsConfig }) => {
  const { setTitle, setLink, setUserInput, title, link, userInput } =
    inputsConfig;

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
      </div>
    </div>
  );
};
