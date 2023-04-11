import { NextRequest, NextResponse } from "next/server";
import { api } from "../../utils/api";
import { submitPost } from "../../services/reddit";
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
  console.log(req.body.redditPostId);
  console.log("_________");

  if (!req.body || !req.body.redditPostId) {
    res.status(200).json({ message: "INVALID BODY" });
    return;
  }

  //   if (req.body.secret !== secret) {
  //     res.status(200).json({ message: "INVALID SECRET" });
  //     return;
  //   }

  const postID = req.body.redditPostId;

  // ***************************************
  // ***************************************
  //              MAIN LOGIC
  // ***************************************
  // ***************************************

  // TIMESTAMP
  const currentTimeStamp = Date.now();

  // GETTING: REDDITPOSTID

  // ***************************************
  // FIND THE SCHEDULED POST

  const result = await prisma.redditPost.findUnique({
    where: {
      redditPostId: postID,
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

  const { url, title, sub, flairId } = result;

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

  res.status(200).json({ message: result?.redditPostId });
  return;
}
