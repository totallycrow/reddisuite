import { NextRequest, NextResponse } from "next/server";
import { api } from "../../utils/api";
import { submitPost } from "../../services/reddit";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextRequest, res: NextResponse) {
  console.log(
    "********************************************************************************"
  );
  const currentTimeStamp = Date.now();
  console.log(currentTimeStamp);
  console.log(typeof currentTimeStamp);
  console.log(1686310029822 < currentTimeStamp);

  const result = await prisma.redditPost.findMany({
    where: {
      SubmissionDate: {
        lt: currentTimeStamp,
      },
      isScheduled: {
        equals: true,
      },
    },
  });
  console.log(result);

  if (result.length === 0 || result === undefined) {
    console.log("LIST EMPTY!!!!!");

    res.status(200).json({ message: "QUEUE EMPTY" });
  }

  for (let i = 0; i < result.length; i++) {
    console.log("LOOP START!!!!");
    // LOOP THROUGH RESULTS
    // FIND AUTHOR ID AND GET TOKEN
    // check if token valid
    //  if not valid refresh token and get new token
    // ADD TO REDDIT
    // WAIT FOR RESULT
    // GRAB INTERNAL POST ID AND UPDATE IN DB

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

    return submissionResult;
    res.status(200).json({ message: "ok" || "not found" });
  }

  res.status(200).json({ message: "ok" || "not found" });

  // return new Response(
  //   // get current timestamp

  //   // get posts from db with date from 0 to current timestamp

  //   // await submitPost()

  //   JSON.stringify({
  //     success: true,
  //   }),
  //   {
  //     status: 200,
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //   }
  // );
}
