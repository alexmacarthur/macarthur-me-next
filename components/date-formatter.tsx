import { ReactNode } from "react";

export default function DateFormatter({
  date,
  prettyDate,
  className = "",
  children,
}: {
  date: string;
  prettyDate: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span className={`text-sm text-gray-500 ${className}`}>
      {children && children} <time dateTime={date}>{prettyDate}</time>
    </span>
  );
}
