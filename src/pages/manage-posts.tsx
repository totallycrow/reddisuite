import { useSession } from "next-auth/react";
import { MainPostController } from "../components/modules/postSubmission/mainPostController/MainPostController";
import { GetServerSideProps } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../server/auth";
import Layout from "../components/ui/Layout";
import { api } from "../utils/api";
import moment from "moment";
import { useState } from "react";
import { InputItem } from "../components/ui/InputItem";
import { PostItem } from "../components/modules/postSubmission/postItem/PostItem";
import { PostModify } from "../components/modules/postSubmission/postModify/PostModify";

export default function Dashboard() {
  const { data: session } = useSession();
  const utils = api.useContext();

  const data = api.reddit.getUserPosts.useQuery();
  const removal = api.reddit.removePostFromSchedule.useMutation({
    async onSettled() {
      await utils.reddit.getUserPosts.invalidate();
    },
  });

  const shouldShowSpinner =
    data.isLoading || data.isFetching || data.isRefetching || removal.isLoading;

  console.log(data);

  if (session) {
    return (
      <Layout>
        <div>Manage Posts</div>
        {shouldShowSpinner ? (
          <div className="flex items-center justify-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ) : (
          ""
        )}
        <div>
          {data && data.data && data.data.length !== 0 && (
            <div>
              {data.data.map((post) => {
                return (
                  <div key={post.id} className="m-4">
                    <PostModify post={post} removal={removal} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Layout>
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
