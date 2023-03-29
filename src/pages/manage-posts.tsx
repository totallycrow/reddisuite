import { useSession } from "next-auth/react";
import { MainPostController } from "../components/modules/postSubmission/mainPostController/MainPostController";
import { GetServerSideProps } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../server/auth";
import Layout from "../components/ui/Layout";
import { api } from "../utils/api";
import moment from "moment";

export default function Dashboard() {
  const { data: session } = useSession();

  const data = api.reddit.getUserPosts.useQuery().data;

  console.log(session);
  console.log(data);

  if (session) {
    return (
      <Layout>
        <div>Manage Posts</div>
        <div>
          {data && data.length !== 0 && (
            <div>
              {data.map((post) => {
                return (
                  <div key={post.id} className="m-4">
                    <h3>Title: {post.title}</h3>
                    <h3>URL: {post.url}</h3>
                    <h3>Subreddit: {post.sub}</h3>
                    <h3>
                      {moment
                        .unix(Number(post.SubmissionDate))
                        .format("dddd, MMMM Do, YYYY h:mm:ss A")}
                    </h3>
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
