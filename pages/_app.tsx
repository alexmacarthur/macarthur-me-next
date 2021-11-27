import "../styles/index.scss";
import { useEffect } from "react";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => require("@ramseyinhouse/feedback-component"), []);
  return <Component {...pageProps} />;
}
