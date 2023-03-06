import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";

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

// useFormController
// useSubmitItemValidation

export const SubmitItem = () => {
  const { data: session } = useSession();

  // Form Controls

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [sub, setSub] = useState("");
  const [debouncedSub, setDebouncedSub] = useState("");
  const [flairList, setFlairList] = useState(Array<IFlair>);
  const [selectedFlair, setSelectedFlair] = useState("");

  // *********************** DATA FETCH / POST *************************************

  const mutation = api.example.sendPost.useMutation();
  const subReddit = api.example.getSubreddit.useQuery(
    { sub: debouncedSub },
    {
      enabled: debouncedSub !== "",
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  // ************************************************************

  useEffect(() => {
    console.log("GETSUBREDDIT TRIGGER");

    if (!subReddit.data) {
      console.log("NO GETSUBREDDIT DATA");
      return;
    }

    console.log(subReddit.data);
  }, [subReddit]);

  useEffect(() => {
    console.log("MUTATION TRIGGER");

    if (!mutation.data) {
      console.log("NO MUTATION DATA");
      return;
    }

    console.log(mutation.data.json);
    const mutationResponse = mutation.data.json;
    // on fail:
    // --> .errors -> []

    // on success
    // --> data.id / .name / .url
    if (mutationResponse.errors && mutationResponse.errors.length === 0) {
      console.log("SUCESS");
    } else {
      console.log("ERROR POSTING DATA!!");
    }
  }, [mutation]);

  const handleSubChange = async () => {
    await subReddit.refetch();
    console.log(subReddit.data);
  };

  useEffect(() => {
    if (sub === "") return;
    void handleSubChange();
  }, [debouncedSub]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSub(sub);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [sub]);

  const sendData = () => {
    console.log("ONCLICK");
    mutation.mutate({
      title: title,
      sub: sub,
      link: link,
      flair: selectedFlair,
    });
    console.log("ONCLICK END");
    return;
  };

  console.log("CLG_______________ MAIN");
  console.log(subReddit.data);
  console.log(subReddit);
  // console.log(subReddit.data.message);
  console.log(flairList);
  console.log(selectedFlair);
  console.log(mutation);
  // console.log(mutation.data.errors);

  if (session) {
    return (
      <div>
        <div className="p-4">
          <h2 className="p-4">Submit Your Post</h2>
          <div>
            <div>
              Title:{" "}
              <input
                type="text"
                className="border-2 border-gray-800"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              Link:{" "}
              <input
                type="text"
                className="border-2 border-gray-800"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <div>
              Subreddit:{" "}
              <input
                type="text"
                className="border-2 border-gray-800"
                value={sub}
                onChange={(e) => setSub(e.target.value)}
              />
            </div>

            {/* // ************************************************************ */}
            {/* <div>
              Flair:{" "}
              <input
                type="text"
                className="border-2 border-gray-800"
                value={flair}
                onChange={(e) => setFlair(e.target.value)}
              />
            </div> */}

            {/* // ************************************************************ */}

            {/* TODO - FLAIRS */}
            {/* https://oauth.reddit.com//r/crowcovers/api/link_flair_v2 */}
          </div>
          <button
            disabled={title === "" || link === "" || sub === "" ? true : false}
            onClick={() => void sendData()}
          >
            Submit
          </button>
        </div>

        <div>{mutation.isLoading && <p>Loading...</p>}</div>
        <div>
          {mutation.data &&
            mutation.data.json &&
            mutation.data.json.errors.length > 0 && (
              <p>{mutation.data.json.errors[0][1]}</p>
            )}
        </div>
        <div>
          {mutation.data && mutation.data.error && (
            <p>{mutation.data.message}</p>
          )}
        </div>

        <div>
          {subReddit.data && subReddit.data.explanation && (
            <p>{subReddit.data.explanation}</p>
          )}
        </div>
        <div>
          {subReddit.data &&
            subReddit.data.flairs &&
            subReddit.data.flairs.length > 0 && (
              <div>
                <p>Flair required:</p>
                <div>
                  <select
                    value={selectedFlair}
                    onChange={(e) => setSelectedFlair(e.target.value)}
                  >
                    {subReddit.data.flairs.map((item) => (
                      <option value={item.id}>{item.text}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
        </div>
        <div>
          {subReddit.data &&
            subReddit.data.titleTags &&
            subReddit.data.titleTags.length > 0 && (
              <p>
                Title tag required: &quot;
                {subReddit.data.titleTags[0]}&quot;
              </p>
            )}
        </div>

        {/*  */}
        {/*  */}
        {/*  */}
        <div></div>
      </div>
    );
  }
  return (
    <div>
      <p>Access Denied</p>
    </div>
  );
};
