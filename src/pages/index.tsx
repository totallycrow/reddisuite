import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        data-theme="garden"
        className="flex min-h-screen flex-col items-center justify-center"
      >
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white"></p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  console.log("SESSION");
  console.log(sessionData?.user.token);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {process.env.NODE_ENV === "development" && <div></div>}
      <button
        className="btn"
        onClick={
          sessionData
            ? () => void signOut()
            : () => void signIn("reddit", { callbackUrl: "/dashboard" })
        }
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

// ************************************************
// CR NOTES
// ************************************************

/*

1.Potential Refactor

********* mainPostController *********

/modules/postSubmission/MainPostController
/hooks/controllers/postSubmission/usePostControls

-> Move mainPostController state values
to a global state (Zustand?) instead of prop-drill? However, 
mainPostController is only used in the schedule-posts view, 
and not in the manage-posts view, 
is it ok to keep it global/separated like this?

-> keep the posts related data in formObserver class? (as they currently are)


********* usePostItemManager *********
/hooks/controllers/postSubmission/usePostItemManager

- handles individual posts, combines post and get handlers & hooks
-> ????





******************************************************
*/
