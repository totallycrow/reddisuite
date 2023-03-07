import React, { useEffect, useState } from "react";

export const useDebouncedSearch = (
  userInput: string,
  callback: () => Promise<void>,
  setLoadingStatus: React.Dispatch<React.SetStateAction<string>>
) => {
  const [debouncedInput, setDebouncedInput] = useState("");
  const [debouncedStatus, setDebouncedStatus] = useState("Idle");

  console.log("DEBOUNCE COMPONENT FIRED");
  console.log(userInput);
  console.log(debouncedInput);

  useEffect(() => {
    if (userInput === "") return;

    const trigger = async () => {
      await callback();
      setDebouncedStatus("Idle");
      setLoadingStatus("Idle");
    };

    void trigger();
  }, [debouncedInput]);

  useEffect(() => {
    if (userInput === "") return;
    const handler = setTimeout(() => {
      setDebouncedInput(userInput);
      //   setDebouncedStatus("E");
    }, 1000);

    return () => {
      clearTimeout(handler);
      setDebouncedStatus("Loading...");
      setLoadingStatus("Loading...");
    };
  }, [userInput]);

  return { debouncedInput, debouncedStatus };
};
