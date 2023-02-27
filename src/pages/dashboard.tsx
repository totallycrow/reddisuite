import { getServerSession } from "next-auth/next";
import { authOptions } from "../server/auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { api, RouterOutputs } from "../utils/api";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [inputData, setInputData] = useState("");
  const [dataGet, setDataGet] = useState("");
  console.log(dataGet);

  const mutation = api.example.sendPost.useMutation();

  console.log(mutation.data);

  useEffect(() => {
    console.log("USE EFFECT");
  }, [mutation]);

  const { data: sessionData } = useSession();

  // TYPE
  // type Test = RouterOutputs["note"]["getAll"][0]

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [sub, setSub] = useState("");
  const [flair, setFlair] = useState("");

  // const { data, refetch } = api.example.getSubreddit.useQuery(
  //   { input: sessionData?.user.token },
  //   {
  //     enabled: false,
  //   }
  // );

  // console.log(data);
  // const getData = () => {
  //   console.log("ONCLICK");
  //   void refetch();
  //   console.log("ONCLICK END");
  //   return;
  // };

  const sendData = async () => {
    console.log("ONCLICK");
    mutation.mutate({
      token: sessionData?.user.token,
      title: title,
      sub: sub,
      link: link,
      flair: flair,
    });
    console.log("ONCLICK END");
    return;
  };

  if (session) {
    return (
      <div>
        <h1>Protected Page</h1>
        <p>You can view this page because you are signed in.</p>

        {/* <p>Returned info: {""}</p>
        <div>{data ? data[0].text : ""}</div>
        <div>
          <input
            className="border-2 border-gray-800"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          ></input>
          <div></div>
          <button onClick={getData}>Verify</button>
        </div> */}

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
            <div>
              Flair:{" "}
              <input
                type="text"
                className="border-2 border-gray-800"
                value={flair}
                onChange={(e) => setFlair(e.target.value)}
              />
            </div>

            {/* TODO - FLAIRS */}
            {/* https://oauth.reddit.com//r/crowcovers/api/link_flair_v2 */}
          </div>
          <button onClick={() => void sendData()}>Submit</button>
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
      </div>
    );
  }
  return (
    <div>
      <p>Access Denied</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getServerSession(context.req, context.res, authOptions),
    },
  };
}
