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

  const { data: sessionData } = useSession();

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

  if (session) {
    return (
      <div>
        <h1>Protected Page</h1>
        <p>You can view this page because you are signed in.</p>

        <p>Returned info: {""}</p>
        <div>{data ? data[0].text : ""}</div>
        <div>
          <input
            className="border-2 border-gray-800"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          ></input>
          <div></div>
          <button onClick={getData}>Verify</button>
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
