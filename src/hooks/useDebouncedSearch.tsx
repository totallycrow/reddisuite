import React, { useEffect, useState } from "react";

export const useDebouncedSearch = (
  userInput: string,
  callback: () => Promise<void>,
  setLoadingStatus?: React.Dispatch<React.SetStateAction<string>>
) => {
  const [debouncedInput, setDebouncedInput] = useState("");
  const [debouncedStatus, setDebouncedStatus] = useState("Idle");

  console.log("DEBOUNCE COMPONENT FIRED");
  console.log(userInput);
  console.log(debouncedInput);

  useEffect(() => {
    if (userInput === "") return;

    console.log(
      "USE EFFECT USE DEBOUNCE _____________________________________________________"
    );

    console.log(userInput);
    const trigger = async () => {
      await callback();
      setDebouncedStatus("Idle");
      if (setLoadingStatus) setLoadingStatus("Idle");
    };

    void trigger();
  }, [debouncedInput]);

  useEffect(() => {
    if (userInput === "") return;

    console.log(
      "USE EFFECT USE DEBOUNCE USER INPUT_____________________________________________________"
    );
    const handler = setTimeout(() => {
      setDebouncedInput(userInput);
      //   setDebouncedStatus("E");
    }, 1000);

    return () => {
      clearTimeout(handler);
      setDebouncedStatus("Loading...");
      if (setLoadingStatus) setLoadingStatus("Loading...");
    };
  }, [userInput]);

  return { debouncedInput, debouncedStatus };
};
