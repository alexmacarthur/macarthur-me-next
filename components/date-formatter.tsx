import { ReactChild, ReactChildren } from "react";

export default function DateFormatter({
  dateString,
  className = "",
  children = null
}: {
  dateString: string;
  className?: string;
  children?: ReactChild | ReactChild[]
}) {
  const date = new Date(`${dateString}T00:00:00.000-05:00`);
  const formattedDate = date.toLocaleString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <span className={`light-text ${className}`}>
      { children } {" "}
      <time dateTime={dateString}>
        {formattedDate}
      </time>
    </span>
  );
}
