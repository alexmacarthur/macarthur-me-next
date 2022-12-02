const Arrow = ({ strokeWidth = "2", ...rest }) => {
  return (
    <figure {...rest}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          className="stroke-current"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    </figure>
  );
};

export default Arrow;
