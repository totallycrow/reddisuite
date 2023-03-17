import React, { useEffect, useState } from "react";

export const useDebouncedSearch = (
  userInput: string,
  callback: () => Promise<void>,
  setLoadingStatus?: React.Dispatch<React.SetStateAction<string>>
) => {
  const [debouncedInput, setDebouncedInput] = useState("");
  const [debouncedStatus, setDebouncedStatus] = useState("Idle");

  useEffect(() => {
    if (userInput === "") return;

    const trigger = async () => {
      await callback();
      setDebouncedStatus("Idle");
      if (setLoadingStatus) setLoadingStatus("Idle");
    };

    void trigger();
  }, [debouncedInput]);

  useEffect(() => {
    if (userInput === "") return;

    const handler = setTimeout(() => {
      setDebouncedInput(userInput);
    }, 1000);

    return () => {
      clearTimeout(handler);
      setDebouncedStatus("Loading...");
      if (setLoadingStatus) setLoadingStatus("Loading...");
    };
  }, [userInput]);

  return { debouncedInput, debouncedStatus };
};
