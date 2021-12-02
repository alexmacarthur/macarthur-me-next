import { CountUp } from 'countup.js';
import { useEffect, useRef } from "react";

const Counter = ({ value, render = null }) => {
    const counterRef = useRef(null);
    const formattedValue = parseInt(value.replace(/\,/g, ''), 10);

    useEffect(() => {
        const element = counterRef.current;
        if (!element) return;

        const countUp = new CountUp(element, formattedValue);

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

    if(render) {
        return render(counterRef);
    }

    return <span ref={counterRef}>0</span>;
}

export default Counter;
