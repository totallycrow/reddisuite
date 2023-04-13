import { RedditPost } from "@prisma/client";
import moment from "moment";
import React, { useState } from "react";
import { api } from "../../../../utils/api";
import { useFormController } from "../../../../hooks/controllers/postSubmission/useFormController";
import { PostItem } from "../postItem/PostItem";

export const PostModify = ({
  post,
  removal,
}: {
  post: RedditPost;
  removal: any;
}) => {
  const [flair, setFlair] = useState(post.flairId);
  const { title, setTitle, link, setLink, userInput, setUserInput } =
    useFormController(post.title, post.url, post.sub);

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
          controllerConfig={{ schedulerModule: true }}
          isScheduler={true}
          postId={post.redditPostId}
        />
        <h3>Title: {title}</h3>
        <h3>URL: {link}</h3>
        <h3>Subreddit: {userInput}</h3>
        <h3>Flair: {flair}</h3>
        <h3>Is Scheduled? {post.isScheduled ? "YES" : "NO"}</h3>
        <h3>Is Submitted Sucessfully? {post.isSuccess ? "YES" : "NO"}</h3>
        <h3>
          {moment(Number(post.SubmissionDate)).format("DD/MM/YYYY kk:mm A")}
        </h3>
        <button
          className="btn"
          onClick={() => {
            removal.mutate({ internalId: post.id });
          }}
        >
          REMOVE
        </button>
      </div>
    </div>
  );
};
