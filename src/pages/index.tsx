import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
import { useEffect, useState } from "react";
import { getToken } from "next-auth/jwt";
import { useMutation } from "@tanstack/react-query";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  console.log(sessionData?.user.token);

  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  // const hello2 = api.example.test.useQuery();
  // const hello2 = api.example.getToken.useQuery();

  // useEffect(() => {
  //   console.log("object");

  //   console.log(hello2.data);

  const secret = process.env.NEXTAUTH_SECRET;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {/* {hello.data ? hello.data.greeting : "Loading tRPC query..."}
              <div>{hello2.data ? hello2.data : "Loading tRPC query..."}</div> */}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const [testState, setTestState] = useState("");
  const { data: sessionData } = useSession();
  console.log("SESSION");
  console.log(sessionData?.user.token);

  console.log("TEST");
  const hello2 = api.example.getToken.useQuery();
  // console.log(hello2.data?.access_token);
  const test1231 = hello2.data?.access_token;
  console.log("___________ACCESS TOKEN_______________");

  console.log(sessionData?.user.token);
  const response = api.example.test2.useQuery(String(sessionData?.user.token));

  console.log("RESSSS");
  console.log(response.isSuccess);
  console.log(response.data);

  const mutation = api.example.sendPost.useMutation();

  const handlePost = () => {
    const res = mutation.mutate(sessionData?.user.token);
    // console.log(res);
    // return res;
    // console.log("click");
    // const input = sessionData?.user.token;
    // const url = "https://oauth.reddit.com/api/v1/api/submit";
    // console.log("&^^^^^^^^^^^^^^^^^^^ REQ EXAMPLE");
    // console.log(url);
    // console.log(input);
    // const response = fetch(url, {
    //   headers: {
    //     Authorization: `bearer ${input}`,
    //   },
    //   body: new URLSearchParams({
    //     sr: "test",
    //     title: "test",
    //     text: "test",
    //   }),
    //   method: "POST",
    // });
    // console.log("_________________________RES____________________________");
    // console.log(response);
    // return res;
    // versje noda
    // await response.json();
    // console.log(res);
    // return res;
  };

  useEffect(() => {
    console.log("object");

    // const url = "https://oauth.reddit.com/api/v1/me/karma";

    // let response = fetch(url, {
    //   headers: {
    //     Authentication: `Bearer ${hello2.data?.access_token}`,
    //     "Access-Control-Allow-Headers": "*",
    //   },
    // });
    if (!sessionData || !sessionData.user.token) return;

    // setTestState(r.getSubmission("2np694").author.name);
  }, [sessionData]);

  // const queryClient = useQueryClient();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
      refetchOnMount: false,
      initialData: () => {
        // if (props.cos) {
        //   queryClient.cancelQueries(["getSecretMessage"])
        //   return props.cos
        // }
      },
    }
  );

  // todo
  // TODO dont delete
  // cherry pick
  // -- addapt to new api (pdf upload field)
  // const { data: secretMessage } = api.example.getSecretMessage.useQuery(
  //   undefined, // no input
  // asd
  // asd
  // ads
  //   { enabled: sessionData?.user !== undefined }
  // );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      {/* -- add new file upload component */}
      {process.env.NODE_ENV === "development" && <div></div>}
      {/* git push -f */}
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={
          sessionData
            ? () => void signOut()
            : () => void signIn("reddit", { callbackUrl: "/dashboard" })
        }
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={
          sessionData
            ? () => {
                const res = handlePost();
                console.log(res);
                console.log("HANDLE CLICK HANDLE CLICK");
              }
            : () => ""
        }
      >
        {sessionData ? "Send test post" : "Log in to send a test post"}
      </button>
    </div>
  );
};
