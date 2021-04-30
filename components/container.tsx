import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  narrow?: boolean;
  classes?: string;
};

export default function Container({
  children,
  narrow = false,
  classes = "px-0",
}: ContainerProps) {
  return (
    <div
      className={`mx-auto md:px-5 text-xl ${
        narrow ? "max-w-prose" : "max-w-6xl"
      } ${classes}`}
    >
      {children}
    </div>
  );
}
