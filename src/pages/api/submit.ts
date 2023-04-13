import { NextRequest, NextResponse } from "next/server";
import { api } from "../../utils/api";
import { refreshToken, submitPost } from "../../services/reddit";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
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
  console.log(secret);

  console.log(req.headers);
  console.log(req.body);
  console.log(secret);
  console.log("_________");
  console.log(req.body.redditPostIds);
  console.log("_________");

  // make redditPosts array of IDs
  // modify payload of cron for the specific date already exists
  // on front, when setting up the post in db?
  //   SAMPLE CRON DATA
  //   {
  //     secret: 'QiYYxpseuHWQxey1ZwrY5pK3sQc3XPfaoXrmH2tEYs',
  //     redditPostId: 'daad1248-92a2-432a-8c1e-08c95431e43e'
  //   }
  //

  if (!req.body || !req.body.redditPostIds) {
    res.status(200).json({ message: "INVALID BODY" });
    return;
  }

  //   if (req.body.secret !== secret) {
  //     res.status(200).json({ message: "INVALID SECRET" });
  //     return;
  //   }

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

    // ***************************************
    // ***************************************

    //   GET USER TO GET TOKEN
    //   TODO: REFRESH TOKEN IF EXPIRED

    const user = await prisma.account.findUnique({
      where: {
        providerAccountId: result.redditAuthorId,
      },
    });

    const { expires_at, refresh_token } = user;

    const { url, title, sub, flairId } = result;

    if (
      result &&
      refresh_token &&
      result.redditAuthorId &&
      expires_at &&
      expires_at <= Math.floor(new Date().getTime() / 1000.0)
    ) {
      console.log("");
      refreshToken(result.redditAuthorId, refresh_token);
    }

    // ***************************************
    //   if (result.length === 0 || result === undefined) {
    //     console.log("LIST EMPTY!!!!!");

    //     res.status(200).json({ message: "EMPTY_QUEUE" });
    //     return;

    //     // res.status(200).json({ message: "QUEUE EMPTY" });
    //   }

    //   ______________-

    console.log("****");
    const accessToken = user?.access_token;

    const submission = await submitPost(accessToken, sub, url, title, flairId);
    console.log(submission);
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
      submission.json.errors[0][0] !== undefined &&
      submission.json.errors[0][0] === "RATELIMIT";

    if (isRateLimit) {
      console.log("RATE LIMIT ERROR, ABORTING OPERATION");

      const submissionResult = await prisma.redditPost.update({
        where: {
          id: result.id,
        },
        data: {
          redditPostId: submission.json.data.id,
          isSuccess: false,
          isScheduled: false,
        },
      });

      res.status(200).json({ message: "RATE_LIMIT" });
      return;
    }

    const submissionResult = await prisma.redditPost.update({
      where: {
        id: result.id,
      },
      data: {
        redditPostId: submission.json.data.id,
        isSuccess: isOK,
        isScheduled: false,
      },
    });

    console.log("Update Result:");
    console.log(submissionResult);
  }

  res.status(200).json({ message: "finished" });
  return;
}
