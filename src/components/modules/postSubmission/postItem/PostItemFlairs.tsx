import React from "react";
import type { IFlair } from "../../../../services/reddit";

export const PostItemFlairs = ({
  isFlairRequired,
  setFlair,
  flairList,
}: {
  isFlairRequired: boolean;
  setFlair: React.Dispatch<React.SetStateAction<string>>;
  flairList: IFlair[];
}) => {
  return (
    <div>
      <div>
        {isFlairRequired && (
          <div className="mt-2 mb-2">
            <p>Flair required:</p>
            <div>
              <select
                className="select-bordered select mt-2 w-full max-w-xs"
                onChange={(e) => setFlair(e.target.value)}
              >
                {flairList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
