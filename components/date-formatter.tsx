export default function DateFormatter({ dateString, className = "" }: { dateString: string, className?: string }) {
  const date = new Date(`${dateString}T00:00:00.000-05:00`);
  const formattedDate = date.toLocaleString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  return <time
    dateTime={dateString}
    className={`font-normal text-base text-gray-500 ${className}`}>
      {formattedDate
    }</time>;
}
