import Head from "next/head";
import { useRouter } from "next/router";

import {
  FB_ADMINS,
  TWITTER_HANDLE,
  ALTERNATE_NAME,
  SITE_URL,
  TITLE,
} from "../lib/constants";

export default function Meta({
  isPost = false,
  description = "I'm Alex MacArthur, a web developer in Nashville-ish, TN.",
  title = "",
  date = null,
  lastUpdated = null,
  subTitle = "",
  image = "https://macarthur.me/open-graph.jpg",
}) {
  const router = useRouter();
  const url = `${SITE_URL}${router.asPath}`.replace(/\/$/, "");
  const computedTitle = title ? `${title} // Alex MacArthur` : TITLE;

  const schemaOrgJSONLD: any[] = [
    {
      "@context": "http://schema.org",
      "@type": "WebSite",
      url: SITE_URL,
      name: TITLE,
      alternateName: subTitle || ALTERNATE_NAME,
    },
  ];

  if (isPost) {
    const entry: { [key: string]: any } = {
      "@context": "http://schema.org",
      "@type": "BlogPosting",
      url: url,
      name: computedTitle,
      alternateName: ALTERNATE_NAME,
      datePublished: new Date(date).toISOString(),
      headline: computedTitle,
      isFamilyFriendly: "true",
      image,
      description,
      author: {
        "@type": "Person",
        name: "Alex MacArthur",
        url: "https://macarthur.me",
      },
    };

    if (subTitle) {
      entry.alternativeHeadline = subTitle;
    }

    if (lastUpdated) {
      entry.dateModified = new Date(lastUpdated).toISOString();
    }

    schemaOrgJSONLD.push(entry);
  }

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }}
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
      {isPost ? (
        <meta property="og:type" content="article" key="og:type" />
      ) : null}

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
