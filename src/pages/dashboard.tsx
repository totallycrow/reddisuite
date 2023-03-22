import { useSession } from "next-auth/react";
import { MainPostController } from "../components/postSubmission/mainPostController/MainPostController";
import { GetServerSideProps } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../server/auth";

export default function Dashboard() {
  const { data: session } = useSession();

  // const [inputData, setInputData] = useState("");

  // TYPE
  // type Test = RouterOutputs["note"]["getAll"][0]

  // const subConfig = {
  //   isFlairRequired: false,
  //   isTitleTagRequired: false,
  // };

  // interface IFlair {
  //   id: string;
  //   name: string;
  // }
  // const flairList: IFlair[] = [];

  // const [title, setTitle] = useState("");
  // const [link, setLink] = useState("");
  // const [sub, setSub] = useState("");
  // const [debouncedSub, setDebouncedSub] = useState("");
  // const [flair, setFlair] = useState("");

  // const [subConfig, setSubConfig] = useState({
  //   isFlairRequired: false,
  //   isTitleTagRequired: false,
  // });

  // *********************** DATA FETCH / POST *************************************

  // const mutation = api.example.sendPost.useMutation();

  // const getSubReddots = useQuery(["aasd", "asdasd"], () => {
  //   // fetcz
  //   // if
  //   // dofeczuj
  // });

  // const subReddit = api.example.getSubreddit.useQuery(
  //   { sub: debouncedSub },
  //   {
  //     enabled: debouncedSub !== "",
  //     refetchOnMount: false,
  //     refetchOnWindowFocus: false,
  //   }
  // );
  // ************************************************************

  // const handleSubChange = async () => {
  //   await subReddit.refetch();
  //   console.log(subReddit.data);
  // };

  // useEffect(() => {
  //   if (sub === "") return;
  //   void handleSubChange();
  // }, [debouncedSub]);

  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedSub(sub);
  //   }, 1000);

  //   return () => {
  //     clearTimeout(handler);
  //   };
  // }, [sub]);

  // useEffect(() => {
  //   const getData = setTimeout(() => {
  //     void handleSubChange();

  //     });
  //   }, 2000)

  //   return () => clearTimeout(getData)
  //   void handleSubChange();
  // }, [sub]);

  // const { data, refetch } = api.example.getSubreddit.useQuery(
  //   { input: sessionData?.user.token },
  //   {
  //     enabled: false,
  //   }
  // );

  // console.log(data);
  // const getData = () => {
  //   console.log("ONCLICK");
  //   void refetch();
  //   console.log("ONCLICK END");
  //   return;
  // };

  // const sendData = async () => {
  //   console.log("ONCLICK");
  //   mutation.mutate({
  //     title: title,
  //     sub: sub,
  //     link: link,
  //     flair: flair,
  //   });
  //   console.log("ONCLICK END");
  //   return;
  // };

  // console.log("CLG_______________ MAIN");
  // console.log(subReddit.data);
  // console.log(subReddit);
  // console.log(subReddit.data.message);

  if (session) {
    return (
      <div className="main-dashboard">
        <div className="border-sm flex justify-center">
          <div className="w-1/6 border-r border-r-slate-700 p-4 text-center">
            <h3>Sidebar</h3>
            <div>Menu 1</div>
            <div>Menu 2</div>
            <div>Menu 3</div>
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
