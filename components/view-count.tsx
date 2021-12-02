import { ReactElement } from "react";
import ViewsIcon from "./icon-views";
import Counter from "./counter";

const ViewCount = ({ count = "" }: { count: string }): ReactElement => {
  if (!count.length) return null;

  return (
    <span
      title={`${count} Google Analytics views`}
      className="flex items-center gap-0.5 text-gray-500 text-sm"
    >
      <ViewsIcon />

      <span className="text-gray-500">
        <Counter value={count} />
      </span>
    </span>
  );
};

export default ViewCount;
