import React, { useMemo } from "react";
import Datetime from "react-datetime";
import moment, { Moment } from "moment";

export const PostItemScheduler = ({
  setPostDate,
  date,
}: {
  setPostDate: React.Dispatch<React.SetStateAction<number>>;
  date: bigint | number;
}) => {
  const yesterday = useMemo(() => moment().subtract(1, "day"), []);

  return (
    <div>
      PostItemScheduler
      <div>
        <div>
          <h4 className="px-4 pt-4 text-lg font-bold">Schedule post time</h4>
          <div className="ml-4 mt-2 mb-4 rounded border-x-4 border-emerald-400 p-4">
            <Datetime
              input={true}
              initialValue={new Date(Number(date))}
              onChange={(moment: string | Moment) => {
                console.log(moment);
                const date = moment.valueOf();
                setPostDate(Number(date));
                return;
              }}
              isValidDate={(currentDate: moment.Moment) =>
                currentDate.isAfter(yesterday)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
