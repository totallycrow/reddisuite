import React, { useState } from "react";

export const useFormController = (initiallink = "", title = "") => {
  const [title, setTitle] = useState(title);
  const [link, setLink] = useState(initiallink);
  const [userInput, setUserInput] = useState("");

  return { title, setTitle, link, setLink, userInput, setUserInput };
};
