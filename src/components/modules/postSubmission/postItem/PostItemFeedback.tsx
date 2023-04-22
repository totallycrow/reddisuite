import React from "react";

export const PostItemFeedback = () => {
  return (
    <div>
      <div>
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
      </div>
    </div>
  );
};
