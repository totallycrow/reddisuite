import React from "react";

export type IBorderColor = string;

type Props = {
  borderColor: IBorderColor;
  children?: React.ReactNode;
};

export const CardContainer: React.FC<Props> = ({ borderColor, children }) => {
  return (
    <div
      className={
        borderColor === "green"
          ? "rounded border border-emerald-400 p-4"
          : borderColor === "red"
          ? "rounded border border-rose-600 p-4"
          : "rounded border border-slate-800 p-4"
      }
    >
      {children}
    </div>
  );
};
