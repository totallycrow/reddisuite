import React, { useEffect, useState } from "react";

export const useDebouncedSearch = (
  userInput: string,
  callback: () => Promise<void>,
  setLoadingStatus?: React.Dispatch<React.SetStateAction<string>>
) => {
  const [debouncedInput, setDebouncedInput] = useState("");
  const [debouncedStatus, setDebouncedStatus] = useState("Idle");

  console.log("USE DEBOUNCED FIRED!!!!");
  console.log(userInput);
  console.log(debouncedInput);
  console.log(debouncedStatus);

  useEffect(() => {
    if (userInput === "") {
      setDebouncedStatus("Idle");
      if (setLoadingStatus) setLoadingStatus("Idle");
      return;
    }
  }, []);

  useEffect(() => {
    if (userInput === "") {
      setDebouncedStatus("Idle");
      if (setLoadingStatus) setLoadingStatus("Idle");
      return;
    }
    const trigger = async () => {
      await callback();
      setDebouncedStatus("Idle");
      if (setLoadingStatus) setLoadingStatus("Idle");
    };

    void trigger();
  }, [debouncedInput]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(userInput);
    }, 1000);

    return () => {
      clearTimeout(handler);
      setDebouncedStatus("Loading...");
      if (setLoadingStatus) setLoadingStatus("Loading...");
    };
  }, [userInput]);

  console.log("USE DEBOUNCED FIRED!!!!");
  console.log(userInput);
  console.log(debouncedInput);
  console.log(debouncedStatus);

  return { debouncedInput, debouncedStatus };
};
