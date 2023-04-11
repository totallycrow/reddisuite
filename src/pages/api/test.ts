import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest, res: NextResponse) {
  console.log("test");
  console.log(req.body);
  console.log(req.body.test);

  // await fetch("https://dummyjson.com/products/1")
  //   .then((res) => res.json())
  //   .then((json) => console.log(json));

  res.status(200).json({ res: req.body.test });
}
