import { NextRequest } from "next/server";
import { refreshToken, submitPost } from "../../services/reddit";
import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";
import {
  generateCronDateString,
  removePostFromCronJob,
} from "../../services/cron";

const prisma = new PrismaClient();

export default async function handler(req: NextRequest, res: NextApiResponse) {
  //

  // ***************************************
  // CHECK FOR REQUEST METHOD
  // ***************************************

  if (req.method !== "POST") {
    res.status(400).send({ message: "" });
    return;
  }
  console.log("STARTING QUEUE");

  // ***************************************
  // CHECK IF REQUEST COMING FROM AUTHORIZED SOURCE
  // ***************************************

  const secret = process.env.API_SECRET;

  if (!req.body || !req.body.redditPostIds) {
    res.status(200).json({ message: "INVALID BODY" });
    return;
  }

  if (req.body.secret !== secret) {
    res.status(200).json({ message: "INVALID SECRET" });
    return;
  }

  const postIDs = req.body.redditPostIds;

  // TIMESTAMP
  const currentTimeStamp = Date.now();

  // GETTING: REDDITPOSTID

  // ***************************************
  // FIND THE SCHEDULED POST

  for (let i = 0; i < postIDs.length; i++) {
    // ***************************************
    // ***************************************
    //              MAIN LOGIC
    // ***************************************
    // ***************************************

    const result = await prisma.redditPost.findUnique({
      where: {
        redditPostId: postIDs[i],
      },
    });

    if (!result) throw new Error("Post not found");

    // ***************************************
    // ***************************************

    //   GET USER TO GET TOKEN / REFRESH IF EXPIRED

    const user = await prisma.account.findUnique({
      where: {
        providerAccountId: result.redditAuthorId,
      },
    });

    if (!user) throw new Error("User not found");
    const { expires_at, refresh_token } = user;
    const { url, title, sub, flairId } = result;

    const internalId = result.id;

    if (
      result &&
      refresh_token &&
      result.redditAuthorId &&
      expires_at &&
      expires_at <= Math.floor(new Date().getTime() / 1000.0)
    ) {
      await refreshToken(result.redditAuthorId, refresh_token);
    }
    const accessToken = user?.access_token;

    if (!accessToken) throw new Error("Invalid access token");

    const submission = await submitPost(accessToken, sub, url, title, flairId);

    if (!submission)
      throw new Error("Something went wrong when submitting the post ");

    // REMOVE JOB FROM CRON
    if (!result.redditPostId) throw new Error("PostId not found");
    await removePostFromCronJob(result.CronJobId, internalId);

    const isOK = submission.json.errors.length === 0;
    console.log("IS RES OK?");
    console.log(isOK);

    // ***************************************
    // ***************************************
    //             HANDLE RESULT
    // ***************************************
    // ***************************************

    const isRateLimit =
      !isOK &&
      submission.json &&
      submission.json.errors &&
      submission.json.errors[0] &&
      submission.json.errors[0][0] !== undefined &&
      submission.json.errors[0][0] === "RATELIMIT";

    if (!isOK) {
      let errorMessage = "";

      if (isRateLimit) {
        errorMessage = "RATE_LIMIT ERROR";
      } else {
        errorMessage = "Error submitting to reddit";
      }
      console.log("RATE LIMIT ERROR, ABORTING OPERATION");
      console.log(submission.json);

      const submissionResult = await prisma.redditPost.update({
        where: {
          id: result.id,
        },
        data: {
          isSuccess: false,
          isScheduled: false,
          SubmissionAttempted: true,
          SubmissionDetails: errorMessage,
        },
      });

      res.status(200).json({ message: errorMessage });
      return;
    }

    // *****************************************************************
    const submissionResult = await prisma.redditPost.update({
      where: {
        id: result.id,
      },
      data: {
        redditPostId: submission.json.data.id,
        isSuccess: isOK,
        isScheduled: false,
        SubmissionAttempted: true,
        SubmissionDetails: "Submitted to Reddit OK",
      },
    });

    console.log("Update Result:");
    console.log(submissionResult);

    console.log("remove from cron now...");

    const date = generateCronDateString(submissionResult.ScheduleDate);

    const cronJobId = result.CronJobId;
    // original postId?
    // postIDs[i]

    const removalResult = await removePostFromCronJob(cronJobId, postIDs[i]);
    console.log(removalResult.status);
  }

  res.status(200).json({ message: "finished" });
  return;
}
