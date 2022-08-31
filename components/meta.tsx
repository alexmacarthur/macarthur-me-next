import Head from "next/head";
import { WebSite, WithContext } from "schema-dts";
import useCurrentUrl from "../hooks/useCurrentUrl";

import {
  FB_ADMINS,
  TWITTER_HANDLE,
  SITE_URL,
  TITLE,
  DESCRIPTION,
  MY_NAME,
} from "../lib/constants";

interface MetaProps {
  schema?: WithContext<any>;
  description?: string;
  title?: string;
  type?: string;
  subtitle?: string;
  image?: string;
}

export default function Meta({
  schema,
  title,
  subtitle,
  description = DESCRIPTION,
  type = "website",
  image = "https://macarthur.me/open-graph.jpg",
}: MetaProps) {
  const url = useCurrentUrl();
  const computedTitle = title ? `${title} // Alex MacArthur` : TITLE;

  const defaultSchema: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE_URL,
    name: TITLE,
    alternateName: subtitle,
    description: DESCRIPTION,
    author: {
      "@type": "Person",
      name: MY_NAME,
      url: SITE_URL,
    },
  };

  console.log("HERE");
  console.log(schema || defaultSchema);

  return (
    <Head>
      <title>{computedTitle}</title>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#000" />
      <link
        rel="alternate"
        type="application/rss+xml"
        href="/feed.xml"
        key="xml_feed"
      />
      <meta name="description" content={description} key="description" />

      {/* Schema.org */}
      <script
        type="application/ld+json"
        key="ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema || defaultSchema),
        }}
      ></script>

      {/* OpenGraph */}
      <meta property="og:url" content={url} key="og:url" />
      <meta property="og:title" content={computedTitle} key="og:title" />
      <meta
        property="og:description"
        content={description}
        key="og:description"
      />
      <meta property="og:image" content={image} key="og:image" />
      <meta property="fb:admins" content={FB_ADMINS} key="fb:admins" />
      <meta property="og:type" content={type} key="og:type" />

      {/* Twitter Card */}
      <meta
        name="twitter:card"
        content="summary_large_image"
        key="twitter:card"
      />
      <meta
        name="twitter:creator"
        content={TWITTER_HANDLE}
        key="twitter:creator"
      />
      <meta name="twitter:title" content={computedTitle} key="twitter:title" />
      <meta
        name="twitter:description"
        content={description}
        key="twitter:description"
      />
      <meta name="twitter:image" content={image} key="twitter:image" />
    </Head>
  );
}
