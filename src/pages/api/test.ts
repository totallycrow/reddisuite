export default async function handler(req, res) {
  console.log("test");

  await fetch("https://dummyjson.com/products/1")
    .then((res) => res.json())
    .then((json) => console.log(json));

  res.status(200).json({ name: "John Doe" });
}
