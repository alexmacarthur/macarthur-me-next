import { ReactElement } from "react";
import ViewsIcon from "./icon-views";

const ViewCount = ({ count }: { count: string }): ReactElement => {
  return (
    <span
      title={`${count} Google Analytics views`}
      className="flex items-center gap-0.5 text-gray-500 text-sm"
    >
      <ViewsIcon />
      <span className="text-gray-500">{count}</span>
    </span>
  );
};

export default ViewCount;
