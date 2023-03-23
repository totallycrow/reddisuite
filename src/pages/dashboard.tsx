import { useSession } from "next-auth/react";
import { MainPostController } from "../components/modules/postSubmission/mainPostController/MainPostController";
import { GetServerSideProps } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../server/auth";

export default function Dashboard() {
  const { data: session } = useSession();

  console.log(session);

  if (session) {
    return (
      <div className="main-dashboard">
        <div className="border-sm flex justify-center">
          <div className="w-1/6 border-r border-r-slate-700 p-4 text-left">
            <div className="sticky top-0 z-50">
              <h3 className="p-2 text-lg font-bold">Menu</h3>
              <div className="p-2">Bulk Submissions</div>
            </div>
          </div>

          <div className="w-5/6 p-8">
            <h1>Protected Page</h1>
            <p>You can view this page because you are signed in.</p>
            Main Content
            <div>
              {" "}
              <MainPostController></MainPostController>
            </div>
          </div>
          {/* <SubmitItem /> */}
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

type PageProps = {
  session: Session | null;
};

// ****************************************************************************************
// ****************************************************************************************
// ****************************************************************************************

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  return {
    props: {
      session: await getServerSession(context.req, context.res, authOptions),
    }, // will be passed to the page component as props
  };
};
