import React, { useState, useRef, useEffect } from "react";
import { createObserver } from "../lib/images";

interface ImageProps {
  src: string;
  alt?: string;
  height?: string;
  width?: string;
  classes?: string;
  loadedClass?: string;
}

const Image = ({
  src,
  alt = "",
  height = "",
  width = "",
  classes = "",
  loadedClass = "opacity-1",
}: ImageProps) => {
  const imageRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const computedClasses = `${classes} ${isLoaded ? loadedClass : "opacity-0"}`;

  useEffect(() => {
    const { kill, observe } = createObserver(imageRef.current, () => {
      setShouldLoad(true);
    });

    observe();

    return () => {
      kill();
    };
  });

  return (
    <img
      ref={imageRef}
      src={shouldLoad ? src : ""}
      alt={alt}
      height={height}
      width={width}
      className={"transition-all " + computedClasses}
      onLoad={() => setIsLoaded(true)}
    />
  );
};

export default Image;
