import { getServerSession } from "next-auth/next";
import { authOptions } from "../server/auth";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <h1>Protected Page</h1>
        <p>You can view this page because you are signed in.</p>
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
