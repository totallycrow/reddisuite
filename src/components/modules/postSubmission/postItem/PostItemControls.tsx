import React from "react";

export const PostItemControls = () => {
  return (
    <div>
      <div>controls</div>
      PostItemControls
      {/* <div>
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
      </div> */}
      <div>
        <button className="btn m-2">Submit</button>
      </div>
    </div>
  );
};
