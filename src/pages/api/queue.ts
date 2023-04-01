import { NextRequest, NextResponse } from "next/server";
import { api } from "../../utils/api";
import { submitPost } from "../../services/reddit";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextRequest, res: NextResponse) {
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

  console.log(req.headers);
  console.log(req.body);
  console.log(secret);

  if (!req.body || !req.body.secret) {
    res.status(200).json({ message: "INVALID" });
    return;
  }

  if (req.body.secret !== secret) {
    res.status(200).json({ message: "INVALID" });
    return;
  }

  // ***************************************
  // ***************************************
  //              MAIN LOGIC
  // ***************************************
  // ***************************************

  console.log(req.headers);

  // TIMESTAMP
  const currentTimeStamp = Date.now();

  // ***************************************
  // FIND POSTS SCHEDULED TO BE SUBMITTED IN THIS QUEUE RUN

  const result = await prisma.redditPost.findMany({
    where: {
      SubmissionDate: {
        lte: currentTimeStamp,
      },
      isScheduled: {
        equals: true,
      },
    },
  });

  // ***************************************
  console.log("NUMBER OF SCHEDULED POSTS:");
  console.log(result.length);
  console.log("LIST OF POSTS:");
  console.log(result);
  // ***************************************

  // ***************************************
  if (result.length === 0 || result === undefined) {
    console.log("LIST EMPTY!!!!!");

    res.status(200).json({ message: "EMPTY_QUEUE" });
    return;

    // res.status(200).json({ message: "QUEUE EMPTY" });
  }
  // ***************************************
  // ***************************************

  // ***************************************
  // ***************************************
  //            MAIN POSTS LOOP
  // ***************************************
  // ***************************************

  // MESSAGE broker
  // message Queue
  // https://www.rabbitmq.com/

  for (let i = 0; i < result.length; i++) {
    console.log("LOOP START!!!!");

    // ***************************************
    // ***************************************
    // LOOP THROUGH RESULTS
    // FIND AUTHOR ID AND GET TOKEN
    // check if token valid
    //  if not valid refresh token and get new token
    // ADD TO REDDIT
    // CHECK RESUTLS: IS REJECTED? IS RATE LIMITED?

    // ***************************************
    /* TODO [OPTIONAL?]: IF RATE LIMIT, TAKE A NOTE OF THAT, AND
    FIND A WAY TO FLAG A USER, NOT TO SUBMIT ANYTHING 
    FROM THAT USER FOR N MINUTES.                  
    */

    // GRAB INTERNAL POST ID AND UPDATE IN DB IF SUCCESSFUL
    // ***************************************
    // ***************************************

    if (!result[i] || result[i] === undefined) return;

    const user = await prisma.account.findUnique({
      where: {
        providerAccountId: result[i].redditAuthorId,
      },
    });

    console.log(user);

    const { url, title, sub } = result[i];

    const accessToken = user?.access_token;

    const res = await submitPost(accessToken, sub, url, title, "");
    console.log(res);
    const isOK = res.json.errors.length === 0;
    console.log("IS RES OK?");
    console.log(isOK);

    // ***************************************
    // ***************************************
    //             HANDLE RESULT
    // ***************************************
    // ***************************************

    const isRateLimit =
      !isOK &&
      res.json.errors[0][0] !== undefined &&
      res.json.errors[0][0] === "RATELIMIT";

    if (isRateLimit) {
      console.log("RATE LIMIT ERROR, ABORTING OPERATION");

      res.status(200).json({ message: "RATE_LIMIT" });
      return;
    }

    const submissionResult = await prisma.redditPost.update({
      where: {
        id: result[i].id,
      },
      data: {
        redditPostId: res.json.data.id,
        isSuccess: isOK,
        isScheduled: false,
      },
    });

    console.log("Update Result:");
    console.log(submissionResult);

    // return submissionResult;
    // res.status(200).json({ message: "ok" || "not found" });
  }
  console.log("______________LOOP FINISHED");

  // END
  res.status(200).json({
    success: true,
  });
  return;
}
