import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../server/auth";
import Layout from "../components/ui/Layout";
import { api } from "../utils/api";
import { PostModify } from "../components/modules/postSubmission/postModify/PostModify";
import { Spinner } from "../components/ui/Spinner";

export default function Dashboard() {
  const { data: session } = useSession();
  const utils = api.useContext();

  const data = api.reddit.getUserPosts.useQuery();
  const userPostsData = data.data;
  const removal = api.reddit.removePostFromSchedule.useMutation({
    async onSettled() {
      await utils.reddit.getUserPosts.invalidate();
    },
  });
  const shouldShowSpinner =
    data.isLoading || data.isFetching || data.isRefetching || removal.isLoading;

  if (session) {
    return (
      <Layout>
        <div>Manage Posts</div>
        {shouldShowSpinner ? <Spinner /> : ""}
        <div>
          {data && userPostsData && userPostsData.length !== 0 && (
            <div>
              {data.data.map((post) => {
                return (
                  <div key={post.id} className="m-4">
                    <PostModify post={post} />
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
