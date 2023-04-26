import { useEffect, useState } from "react";
import type { IConfig } from "./usePostControls";

export const useFormController = (
  initialTitle = "",
  initiallink = "",
  initialInput = ""
): IConfig => {
  const [title, setTitle] = useState(initialTitle);
  const [link, setLink] = useState(initiallink);
  const [userInput, setUserInput] = useState(initialInput);

  // LISTEN FOR MAIN INPUT CONTROLLER CHANGES
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    setLink(initiallink);
  }, [initiallink]);

  useEffect(() => {
    setUserInput(initialInput);
  }, [initialInput]);

  return { title, setTitle, link, setLink, userInput, setUserInput };
};
