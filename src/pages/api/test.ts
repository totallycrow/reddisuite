import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest, res: NextResponse) {
  console.log("test");
  console.log(req.body);

  // await fetch("https://dummyjson.com/products/1")
  //   .then((res) => res.json())
  //   .then((json) => console.log(json));

  // res.status(200).json({ res: req.body.test });

  try {
    const json = await req.json();
    console.log({ json });

    return new Response(JSON.stringify(json), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(null, { status: 400, statusText: "Bad Request" });
  }
}
