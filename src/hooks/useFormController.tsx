import React, { useState } from "react";

export const useFormController = () => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [userInput, setUserInput] = useState("");

  return { title, setTitle, link, setLink, userInput, setUserInput };
};
