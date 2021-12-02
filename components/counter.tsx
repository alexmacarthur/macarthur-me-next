import { CountUp } from 'countup.js';
import { useEffect, useRef, useState } from "react";

const Counter = ({ value, waitUntilVisible = true, classes = "" }) => {
    const counterRef = useRef(null);
    const formattedValue = parseInt(value.replace(/\,/g, ''), 10);  
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const element = counterRef.current;
        if (!element) return;

        // Accessibility!
        if (window?.matchMedia("(prefers-reduced-motion: reduce)")?.matches) return;

        const countUp = new CountUp(element, formattedValue);

        if (!waitUntilVisible) return countUp.start();

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    countUp.start();
                    observer.unobserve(element);
                }
            });
        }, {
            rootMargin: "0px",
            threshold: 1.0,
        });

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        }
    }, []);

    return (
        <span ref={counterRef} className={classes}>
            {isMounted ? value : "-"}
        </span>
    );
}

export default Counter;
