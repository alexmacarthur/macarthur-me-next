import { CountUp } from "countup.js";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/utils";

const Counter = ({
  value,
  waitUntilVisible = true,
  classes = "",
  disableAnimation = false,
  showNumberBeforeMount = true
}) => {
  const counterRef = useRef(null);
  const formattedValue = parseInt(value.replace(/\,/g, ""), 10);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const element = counterRef.current;
    if (!element) return;

    // Accessibility!
    if (disableAnimation || prefersReducedMotion()) return;

    const countUp = new CountUp(element, formattedValue);

    if (!waitUntilVisible) return countUp.start();

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            countUp.start();
            observer.unobserve(element);
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, []);

  const getInitialValue = () => {
    if (showNumberBeforeMount) return value;

    return isMounted ? value : "-";
  }

  return (
    <span ref={counterRef} className={classes}>
      {getInitialValue()}
    </span>
  );
};

export default Counter;
