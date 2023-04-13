import { Account, PrismaClient } from "@prisma/client";
import axios from "axios";
import { ISubmissionResponse } from "../server/api/routers/reddit";
import { v4 as uuidv4 } from "uuid";
import { TokenSet } from "next-auth";

export interface IFullSubredditData {
  flairs: IFlair[];
  titleTags: string[];
  subredditInfo: ISubredditInfo;
}

export interface IFlair {
  type: string;
  text_editable: boolean;
  allowable_content: string;
  text: string;
  max_emojis: number;
  text_color: string;
  mod_only: boolean;
  css_class: string;
  richtext: [];
  background_color: string;
  id: string;
}

export interface ISubredditRequirementsConfig {
  token: string;
  subReddit: string;
  isFlairNeeded: boolean;
  isTitleTagNeeded: boolean;
}

export interface ISubredditInfo {
  title_regexes: string[];
  body_blacklisted_strings: string[];
  title_blacklisted_strings: string[];
  body_text_max_length: string | null;
  title_required_strings: string[];
  guidelines_text: string | null;
  gallery_min_items: string | null;
  domain_blacklist: string[];
  domain_whitelist: string[];
  title_text_max_length: string | null;
  body_restriction_policy: string;
  link_restriction_policy: string;
  guidelines_display_policy: string | null;
  body_required_strings: string[];
  title_text_min_length: string | null;
  gallery_captions_requirement: string;
  is_flair_required: true;
  gallery_max_items: string | null;
  gallery_urls_requirement: string;
  body_regexes: string[];
  link_repost_age: string | null;
  body_text_min_length: string | null;
}

export interface ISubredditError {
  explanation: string;
  message: string;
  reason: string;
}

export const getSubredditRequirements = async (
  token: string,
  subReddit: string
): Promise<IFullSubredditData | ISubredditError> => {
  const url = `https://oauth.reddit.com/api/v1/${subReddit}/post_requirements`;

  const response = await axios.get<ISubredditInfo | ISubredditError>(url, {
    method: "GET",
    headers: {
      Authorization: `bearer ${token}`,
    },
    url: url,
    validateStatus: undefined,
  });

  if (response.status === 400 || response.status === 404) {
    return response.data as ISubredditError;
  }

  if (
    Object.hasOwn(response.data, "message") &&
    Object.hasOwn(response.data, "explanation") &&
    Object.hasOwn(response.data, "reason")
  ) {
    return response.data as ISubredditError;
  }

  const validatedData = response.data as ISubredditInfo;
  const isFlairNeeded = validatedData.is_flair_required === true;
  const isTitleTagNeeded = validatedData.title_required_strings.length > 0;
  const isMoreSubredditInfoNeeded = isFlairNeeded || isTitleTagNeeded;

  //   CHECK FURTHER DATA

  //   NO DATA NEEDED
  if (!isMoreSubredditInfoNeeded) {
    const data = {
      flairs: [],
      titleTags: [],
      subredditInfo: response.data as ISubredditInfo,
    };
    return data;
  }

  //   MORE INFO NEEDED

  const subFlairs = await getSubredditFlairs(token, subReddit);

  const data = {
    flairs: subFlairs,
    titleTags: validatedData.title_required_strings,
    subredditInfo: response.data as ISubredditInfo,
  };
  return data;
};

const prisma = new PrismaClient();

export const addPostToDb = async (
  postId: string,
  authorId: string,
  title: string,
  url: string,
  sub: string,
  status: boolean,
  date: any,
  flairId: string,
  isScheduled: boolean
) => {
  const result = await prisma.redditPost.upsert({
    where: {
      redditPostId: postId,
    },
    update: {
      redditPostId: postId,
      title: title,
      redditAuthorId: authorId,
      url: url,
      sub: sub,
      flairId: flairId,
      isSuccess: status,
      SubmissionDate: parseInt(date),
      isScheduled: isScheduled,
    },
    create: {
      redditPostId: postId,
      title: title,
      redditAuthorId: authorId,
      url: url,
      sub: sub,
      flairId: flairId,
      isSuccess: status,
      SubmissionDate: parseInt(date),
      isScheduled: isScheduled,
    },
  });

  return result;
};

export const getSubredditFlairs = async (token: string, subReddit: string) => {
  const url = `https://oauth.reddit.com//r/${subReddit}/api/link_flair_v2`;

  const response = await axios.get(url, {
    method: "GET",
    headers: {
      Authorization: `bearer ${token}`,
    },
    url: url,
    validateStatus: undefined,
  });

  if (response.status === 400 || response.status === 404) {
    throw new Error("Error fetching flairs");
  }

  if (!Array.isArray(response.data)) throw new Error("No valid flairs found");

  return response.data as IFlair[];
};

export const delay = async (delayMs: number) =>
  await new Promise((resolve) => setTimeout(resolve, delayMs));

export const submitPost = async <ResponseType>(
  token: string,
  sub: string,
  link: string,
  title: string,
  flair: string
) => {
  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SUBMIT FIRED");
  const url = `https://oauth.reddit.com/api/submit`;
  const parambody = new URLSearchParams({
    ad: "false",
    api_type: "json",
    app: "test",
    extension: "json",
    sr: sub,
    title: title,
    url: link,
    kind: "link",
    resubmit: "true",
    nsfw: "false",
    flair_id: flair,
  });
  console.log(parambody);

  // const response = await axios.get(url, {
  //   method: "POST",
  //   headers: {
  //     Authorization: `bearer ${token}`,
  //     "Content-Type": "application/x-www-form-urlencoded",
  //   },
  //   data: parambody,

  const response: ISubmissionResponse = await axios<ISubmissionResponse>({
    method: "POST",
    url: url,
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: parambody,
  }).then((response) => response.data);
  console.log("**************************))00000000000%%%%%%%%%%%%%%%%%%%%%%");
  console.log(response);

  if (response.json.errors.length > 0) {
    console.log(response.json.errors);
  }

  // console.log(response.json.data.id);
  // console.log(response.json.errors);
  console.log("**************************))00000000000%%%%%%%%%%%%%%%%%%%%%%");

  return response;
};

export const refreshToken = async (
  refresh_token: string,
  providerAccountId: string
) => {
  console.log("$$$$$$$$$$$$$$$ REFRESH TOKEN STARTS $$$$$$$$$$$$$$$$$$$$$$");
  try {
    const user = process.env.REDDIT_CLIENT_ID;
    const pass = process.env.REDDIT_CLIENT_SECRET;

    if (!user || !pass) throw new Error("INVALID USER/PASS ENV CREDENTIALS");

    const base64encodedData = Buffer.from(user + ":" + pass).toString("base64");

    if (refresh_token === null) throw new Error("Invalid refresh token");

    const response = await fetch("https://www.reddit.com/api/v1/access_token", {
      headers: {
        Authorization: `Basic ${base64encodedData}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
      method: "POST",
    });

    const tokens: TokenSet = (await response.json()) as TokenSet;
    if (!response.ok) throw tokens;

    await prisma.account.update({
      data: {
        access_token: tokens.access_token,
        expires_at:
          Math.floor(new Date().getTime() / 1000.0) +
          parseInt(parseInt(tokens.expires_in)),
        refresh_token: tokens.refresh_token ?? refresh_token,
      },
      where: {
        provider_providerAccountId: {
          provider: "reddit",
          providerAccountId: providerAccountId,
        },
      },
    });
  } catch (error) {
    console.error("Error refreshing access token", error);
  }
};
// ***********************************
