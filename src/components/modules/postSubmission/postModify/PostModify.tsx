import { RedditPost } from "@prisma/client";
import moment from "moment";
import React, { useState } from "react";
import { api } from "../../../../utils/api";
import { useFormController } from "../../../../hooks/controllers/postSubmission/useFormController";
import { PostItem } from "../postItem/PostItem";
import { CardContainer } from "../../../ui/CardContainer";

export const PostModify = ({ post }: { post: RedditPost }) => {
  const config = {
    schedulerModule: true,
    updaterModule: true,
    isLocked: false,
    additionalDetails: post.SubmissionDetails,
  };

  const utils = api.useContext();
  const { title, setTitle, link, setLink, userInput, setUserInput } =
    useFormController(post.title, post.url, post.sub);

  const date = post.ScheduleDate;
  const removal = api.reddit.removePostFromSchedule.useMutation({
    async onSettled() {
      await utils.reddit.getUserPosts.invalidate();
    },
  });

  if (post.SubmissionAttempted === true || post.isScheduled === false) {
    config.isLocked = true;
  }

  return (
    <div>
      <div>
        <PostItem
          title={title}
          link={link}
          subreddit={userInput}
          triggerLocalChange={() => ""}
          setIsAnyInputSubmitting={() => ""}
          isAnyInputSubmitting={false}
          controllerConfig={config}
          postId={post.redditPostId || ""}
          postDate={date}
          removal={() => {
            removal.mutate({ internalId: post.id });
          }}
        />
        {/* <h3>Title: {title}</h3>
        <h3>URL: {link}</h3>
        <h3>Subreddit: {userInput}</h3>
        <h3>Flair: {flair}</h3>
        <h3>Is Scheduled? {post.isScheduled ? "YES" : "NO"}</h3>
        <h3>Is Submitted Sucessfully? {post.isSuccess ? "YES" : "NO"}</h3>
        <h3>
          {moment(Number(post.SubmissionDate)).format("DD/MM/YYYY kk:mm A")}
        </h3> */}
        {/* <button
          className="btn"
          onClick={() => {
            removal.mutate({ internalId: post.id });
          }}
        >
          REMOVE
        </button> */}
      </div>
    </div>
  );
};
