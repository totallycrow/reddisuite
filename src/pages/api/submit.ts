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

  console.log(req.headers);
  console.log(req.body);
  console.log(secret);
  console.log("_________");
  console.log(req.body.redditPostId);
  console.log("_________");

  if (!req.body || !req.body.secret || !req.body.redditPostId) {
    res.status(200).json({ message: "INVALID" });
    return;
  }

  if (req.body.secret !== secret) {
    res.status(200).json({ message: "INVALID" });
    return;
  }

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
  console.log("NUMBER OF SCHEDULED POSTS:");
  console.log(result);

  // ***************************************

  //   GET USER TO GET TOKEN
  //   TODO: REFRESH TOKEN IF EXPIRED

  const user = await prisma.account.findUnique({
    where: {
      providerAccountId: result.redditAuthorId,
    },
  });

  console.log("****** USER *********");
  console.log(user);

  const { url, title, sub } = result;

  // ***************************************
  if (result.length === 0 || result === undefined) {
    console.log("LIST EMPTY!!!!!");

    res.status(200).json({ message: "EMPTY_QUEUE" });
    return;

    // res.status(200).json({ message: "QUEUE EMPTY" });
  }

  //   ______________-

  res.status(200).json({ message: result?.redditPostId });
  return;
}
