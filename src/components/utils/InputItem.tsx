import React from "react";

export const InputItem = ({
  title,
  value,
  type,
  placeholder,
  callback,
  disabled,
  label = "",
  isValid,
}: {
  title: string;
  key: string;
  value: string;
  type: string;
  placeholder: string;
  callback: React.Dispatch<React.SetStateAction<string>>;
  disabled: boolean;
  label: string;
  isValid: boolean;
}) => {
  return (
    <div>
      <label className="label">{label}</label>
      <label className="input-group">
        <span className="w-32">{title}</span>
        <input
          disabled={disabled}
          type={type}
          placeholder={placeholder}
          className={
            isValid
              ? "input-bordered input"
              : "input-bordered input-error input w-full max-w-xs"
          }
          value={value}
          onChange={(e) => callback(e.target.value)}
        />
      </label>
    </div>
  );
};
