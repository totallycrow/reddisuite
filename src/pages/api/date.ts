export default async function handler(req: NextRequest, res: NextResponse) {
  const unixDate = 1681462522300;
  const date = new Date(unixDate);

  const minutes = date.getMinutes();
  const hours = date.getHours();
  const days = date.getDate();
  const months = date.getMonth() + 1;
  const dayOfWeek = date.getDay();

  const cronString = `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;

  console.log(cronString);

  // await fetch("https://dummyjson.com/products/1")
  //   .then((res) => res.json())
  //   .then((json) => console.log(json));

  res.status(200).json({ date: cronString });
}
