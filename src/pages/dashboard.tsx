import { getServerSession } from "next-auth/next";
import { authOptions } from "../server/auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "../utils/api";

export default function Dashboard() {
  const { data: session } = useSession();
  const [inputData, setInputData] = useState("");
  const [dataGet, setDataGet] = useState("");
  console.log(dataGet);

  const mutation = api.example.sendPost.useMutation();

  const { data: sessionData } = useSession();

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [sub, setSub] = useState("");

  const { data, refetch } = api.example.getSubreddit.useQuery(
    { input: sessionData?.user.token },
    {
      enabled: false,
    }
  );

  console.log(data);
  const getData = () => {
    console.log("ONCLICK");
    void refetch();
    console.log("ONCLICK END");
    return;
  };

  const sendData = async () => {
    console.log("ONCLICK");
    mutation.mutate({
      token: sessionData?.user.token,
      title: title,
      sub: sub,
      link: link,
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

        <div>
          <h2>Submit Your Post</h2>
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
          </div>
          <button onClick={() => void sendData()}>Submit</button>
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
