import '../styles/index.scss'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { gtag, pageView} from "../lib/ga";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      pageView(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };

  }, [router.events]);

  useEffect(() => {
    gtag('js', new Date());
    pageView(window.location.pathname);
  }, []);

  return <Component {...pageProps} />
}

