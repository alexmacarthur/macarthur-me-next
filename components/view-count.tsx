import { ReactElement, useEffect } from "react";
import ViewsIcon from "./icon-views";
import Counter from "./counter";

const ViewCount = ({
  count = "",
  disableAnimation = false,
}: {
  count: string;
  disableAnimation?: boolean;
}): ReactElement => {
  if (!count) return null;

  return (
    <span
      title={`${count} Google Analytics views`}
      className="flex items-center gap-0.5 text-gray-500 text-sm"
    >
      <ViewsIcon />

      <span className="text-gray-500">
        <Counter value={count} disableAnimation={disableAnimation} />
      </span>
    </span>
  );
};

export default ViewCount;
