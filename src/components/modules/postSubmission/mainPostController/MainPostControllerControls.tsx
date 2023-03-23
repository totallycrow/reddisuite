import React from "react";

export const MainPostControllerControls = ({
  isAnySubmitted,
  isMainPostControllerFullyValidated,
  debouncedStatus,
  isAnyInputSubmitting,
  publish,
}: {
  isAnySubmitted: boolean;
  isMainPostControllerFullyValidated: boolean;
  debouncedStatus: string;
  isAnyInputSubmitting: boolean;
  setIsAnyInputSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  publish: () => void;
}) => {
  return (
    <div>
      <button
        className="btn m-2"
        disabled={
          isAnySubmitted ||
          !isMainPostControllerFullyValidated ||
          debouncedStatus === "Loading..." ||
          isAnyInputSubmitting
        }
        onClick={() => publish()}
      >
        submit all
      </button>
      {/* <button
        className="btn m-2"
        onClick={() => {
          console.log(formObserver.getFormItems());
        }}
      >
        log form items
      </button> */}
      <div>
        <h3 className="px-4 pt-4 text-lg font-bold">Your Submissions</h3>
      </div>
      <div className="flex w-full flex-col">
        <div className="divider"></div>
      </div>
      <div>
        {debouncedStatus === "Loading..." ? (
          <div className="flex items-center justify-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
