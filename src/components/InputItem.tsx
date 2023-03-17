import React from "react";

export const InputItem = (props: any) => {
  return (
    <div>
      <label className="label">{props.label}</label>
      <label className="input-group">
        <span className="w-32">{props.title}</span>
        <input
          disabled={props.disabled}
          type={props.type}
          placeholder={props.placeholder}
          className="input-bordered input"
          value={props.value}
          onChange={(e) => props.callback(e.target.value)}
        />
      </label>
    </div>
  );
};
