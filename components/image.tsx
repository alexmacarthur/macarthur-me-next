import React, { useState, useRef, useEffect } from 'react';

interface ImageProps {
  src: string,
  alt?: string,
  height?: string,
  width?: string,
  classes?: string,
  loadedClass?: string
}

const createObserver = (imageElement, callback: () => any) => {
  const options = {
    rootMargin: '100px',
    threshold: 1.0
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.unobserve(imageElement);
        callback();
      }
    });
  }, options);

  return {
    observe: () => observer.observe(imageElement),
    kill: () => observer.observe(imageElement)
  }
}

const Image = ({ src, alt = "", height = "", width = "", classes = "", loadedClass = "" }: ImageProps) => {
  const imageRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const computedClasses = `${classes} ${isLoaded ? loadedClass : ''}`;

  useEffect(() => {
    const { kill, observe } = createObserver(imageRef.current, () => {
      setShouldLoad(true);
    });

    observe();

    return () => {
      kill();
    }
  }, []);

  return (
    <span>
      <img
        ref={imageRef}
        src={shouldLoad ? src : ""}
        alt={alt}
        height={height}
        width={width}
        className={computedClasses}
        onLoad={() => setIsLoaded(true)}
      />
    </span>
  )
}

export default Image;
