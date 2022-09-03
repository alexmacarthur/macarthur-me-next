import { useEffect, useRef, useState } from "react";

const usePostViews = (slug) => {
  let [postViews, setPostViews] = useState(null);
  let mountedRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      fetch(`/api/analytics?slug=${slug}`)
        .then((response) => response.json())
        .then(({ views }) => {
          if (mountedRef.current) {
            setPostViews(views);
          }
        });
    }, 500);
  }, [slug]);

  return postViews;
};

export default usePostViews;
