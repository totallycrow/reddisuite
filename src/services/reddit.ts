import axios from "axios";

// const getabcRequest = "https://oauth.reddit.com/api/v1/me/prefs"

// const fetchSingleAbc = (data) => {
//     return axios(getabcRequest, {data})

// }

interface IFullSubredditData {
  flairs: IFlair[];
  titleTags: string[];
  subredditInfo: ISubredditInfo;
}

interface IFlair {
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

interface ISubredditRequirementsConfig {
  token: string;
  subReddit: string;
  isFlairNeeded: boolean;
  isTitleTagNeeded: boolean;
}

interface ISubredditInfo {
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

interface ISubredditError {
  explanation: string;
  message: string;
  reason: string;
}

export const getSubredditRequirements = async (
  token: string,
  subReddit: string
): Promise<IFullSubredditData | ISubredditError> => {
  const url = `https://oauth.reddit.com/api/v1/${subReddit}/post_requirements`;
  console.log(
    "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ SERVICES @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
  );
  console.log(url);

  const response = await axios.get<ISubredditInfo | ISubredditError>(url, {
    method: "GET",
    headers: {
      Authorization: `bearer ${token}`,
    },
    url: url,
    // ??????
    validateStatus: undefined,
  });
  console.log(response.data);

  //   if (typeof response !== "object" || response === null)
  //     throw new Error("Error");

  //   if (!Object.hasOwn(response, "status"))
  //     throw new Error("Error fetching data");

  if (response.status === 400 || response.status === 404) {
    console.log("RESPONSE STATUS CAUGHT 400 OR 404");

    return response.data as ISubredditError;
  }

  if (
    Object.hasOwn(response.data, "message") &&
    Object.hasOwn(response.data, "explanation") &&
    Object.hasOwn(response.data, "reason")
  ) {
    console.log("ERROR PATH");
    console.log(response.data);
    return response.data as ISubredditError;
  }

  const validatedData = response.data as ISubredditInfo;
  const isFlairNeeded = validatedData.is_flair_required === true;
  const isTitleTagNeeded = validatedData.title_required_strings.length > 0;
  const isMoreSubredditInfoNeeded = isFlairNeeded || isTitleTagNeeded;

  //   CHECK FURTHER DATA

  //   NO DATA NEEDED
  if (!isMoreSubredditInfoNeeded) {
    console.log("ALL GOOD, NO MORE INFO NEEDED");
    // return response.data as ISubredditInfo;

    const data = {
      flairs: [],
      titleTags: [],
      subredditInfo: response.data as ISubredditInfo,
    };

    return data;
  }

  //   TODO
  //   need flair?
  // const flair = getFlair()
  //
  //

  console.log(
    "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ SERVICES @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
  );

  //   MORE INFO NEEDED

  const subFlairs = await getSubredditFlairs(token, subReddit);

  const data = {
    flairs: subFlairs,
    titleTags: validatedData.title_required_strings,
    subredditInfo: response.data as ISubredditInfo,
  };
  return data;
};

//   if (response) return response as string;

//   return response as number;

// const fetchMultipleAbc = (data) => {
//     const requests = data.map(el => {
//         return () => axios(getabcRequest, {el.data})
//     })

//   return Promise.all(requests)
// }

// export {
//     fetchSingleAbc
// }

export const getSubredditFlairs = async (token: string, subReddit: string) => {
  const url = "https://oauth.reddit.com//r/crowcovers/api/link_flair_v2";
  const response = await axios.get(url, {
    method: "GET",
    headers: {
      Authorization: `bearer ${token}`,
    },
    url: url,

    validateStatus: undefined,
  });
  console.log(response.data);

  if (response.status === 400 || response.status === 404) {
    console.log("RESPONSE STATUS CAUGHT 400 OR 404");

    throw new Error("Error fetching flairs");
  }

  if (!Array.isArray(response.data)) throw new Error("No valid flairs found");

  return response.data as IFlair[];
};
