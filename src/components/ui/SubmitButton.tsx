import React from "react";

export const SubmitButton = ({
  isButtonDisabled,
  callback,
  buttonText,
}: {
  isButtonDisabled: boolean;
  callback: () => void;
  buttonText: string;
}) => {
  return (
    <button
      className="btn m-2"
      disabled={isButtonDisabled}
      onClick={() => {
        void callback();
      }}
    >
      {buttonText}
    </button>
  );
};
