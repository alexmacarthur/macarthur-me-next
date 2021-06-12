import { ReactChild } from "react";

export default function DateFormatter({
  date,
  className = "",
  children = null,
}: {
  date: string | Date;
  className?: string;
  children?: ReactChild | ReactChild[];
}) {
  const dateObject =
    date instanceof Date ? date : new Date(`${date}T00:00:00.000-05:00`);
  const formattedDate = dateObject.toLocaleString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <span className={`light-text ${className}`}>
      {children}{" "}
      <time dateTime={dateObject.toISOString()}>{formattedDate}</time>
    </span>
  );
}
