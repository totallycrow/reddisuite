import React from "react";
import { InputItem } from "../../utils/InputItem";
import { IConfig } from "../../../hooks/usePostControls";
import { ITitleLinkValidation } from "./MainPostController";

export const MainPostControllerInputs = ({
  inputsConfig,
  validation,
}: {
  inputsConfig: IConfig;
  validation: ITitleLinkValidation;
}) => {
  const { setTitle, setLink, setUserInput, title, link, userInput } =
    inputsConfig;

  return (
    <div>
      <div className="form-control">
        <h2 className="p-8 text-lg font-bold">
          Bulk Subreddits Submission Controller
        </h2>

        {/* **************************************************************************************** */}

        <InputItem
          title={"Post Title"}
          label="Insert a title of your post. Warning: some subreddits might require tags such as [m] or [f]."
          value={title}
          type="text"
          placeholder="Enter your image title here..."
          callback={setTitle}
          isValid={validation.isTitleValidated}
        />

        {/* **************************************************************************************** */}
        <InputItem
          title={"Link URL"}
          label="Insert a URL of your image. Warning: some subreddits require a specific host (IMGUR preferred)"
          value={link}
          type="text"
          placeholder="Enter your image link here..."
          callback={setLink}
          isValid={validation.isLinkValidated}
        />

        {/* **************************************************************************************** */}

        <InputItem
          title={"Subreddit"}
          label={`Enter a comma-separated list of subreddits. Example format: "askUK,gaming,photography"`}
          value={userInput}
          type="text"
          placeholder="Enter your image link here..."
          callback={setUserInput}
          isValid={true}
        />
      </div>
    </div>
  );
};
