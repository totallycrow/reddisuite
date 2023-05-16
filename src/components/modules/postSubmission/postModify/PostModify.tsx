import type { RedditPost } from "@prisma/client";
import { api } from "../../../../utils/api";
import { useFormController } from "../../../../hooks/controllers/postSubmission/useFormController";
import { PostItem } from "../postItem/PostItem";

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
          formControls={
            <SubmitButton
              isButtonDisabled={false}
              callback={() => {
                removal.mutate({ internalId: post.id });
              }}
              buttonText={"Remove"}
            />
          }
          removal={() => {
            removal.mutate({ internalId: post.id });
          }}
        />
      </div>
    </div>
  );
};
