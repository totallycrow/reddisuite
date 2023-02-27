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
  console.log(dataGet[0].text);

  const { data: sessionData } = useSession();

  const { data, refetch } = api.example.getSubreddit.useQuery(
    sessionData?.user.token,
    {
      enabled: false,
    }
  );

  const getData = async (token: string) => {
    console.log(data);
    await refetch();

    setDataGet(data);
    return;
  };

  if (session) {
    return (
      <div>
        <h1>Protected Page</h1>
        <p>You can view this page because you are signed in.</p>
        <p>Returned info: {""}</p>
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
