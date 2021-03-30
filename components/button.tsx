import Link from "next/link";
import { forwardRef } from "react";
import Arrow from "./arrow";

const ExternalIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 ml-2">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

const Button = ({
  children,
  href = "",
  small = false,
  classes = "",
  pointLeft = false,
  naked = false,
  internal = false,
  inheritColor = false,
  ...otherProps
}) => {
  const defaultClasses = `transition-all inline-flex items-center cursor-pointer ${
    small ? "text-base" : ""
  } ${pointLeft ? "flex-row-reverse" : ""} `;
  let buttonColors = naked
    ? "text-purple-400 hover:text-purple-500 "
    : "text-white bg-purple-400 hover:text-white hover:bg-purple-500 ";

  if (inheritColor) {
    buttonColors = naked
      ? "text-gray-500 hover:text-gray-700 "
      : "text-white bg-gray-500 hover:text-white hover:bg-gray-700 ";
  }
  const buttonPadding = naked ? "" : "px-4 py-2 rounded-md";
  const iconDimensions = small ? "h-4 w-4" : "h-6 w-6";
  const iconRotation = pointLeft ? "transform rotate-180" : "";
  const iconMargin = pointLeft ? "mr-2" : "ml-2";

  const ButtonLink = forwardRef(() => {
    return (
      <a
        {...otherProps}
        className={defaultClasses + buttonColors + buttonPadding + classes}
        href={href}
      >
        {children}

        {!internal && <ExternalIcon />}

        {internal && <Arrow
          className={`block ${iconMargin} ${iconDimensions} ${iconRotation}`}
        />}
      </a>
    );
  });

  // Wrap in special, magic link component.
  if (internal) {
    return (
      <Link href={href}>
        <ButtonLink />
      </Link>
    );
  }

  return <ButtonLink />;
};

export default Button;
