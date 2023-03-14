import React, { useState } from "react";

export const useFormController = (
  initialTitle = "",
  initiallink = "",
  initialInput = ""
) => {
  const [title, setTitle] = useState(initialTitle);
  const [link, setLink] = useState(initiallink);
  const [userInput, setUserInput] = useState(initialInput);

  return { title, setTitle, link, setLink, userInput, setUserInput };
};
