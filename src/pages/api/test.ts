import { NextRequest } from "next/server";
import { api } from "../../utils/api";
import { submitPost } from "../../services/reddit";

export default async function handler(req: NextRequest) {
  return new Response(
    // get current timestamp

    // get posts from db with date from 0 to current timestamp

    // await submitPost()

    JSON.stringify({
      success: true,
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
