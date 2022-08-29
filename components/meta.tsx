import Head from "next/head";
import { useRouter } from "next/router";

import {
  FB_ADMINS,
  TWITTER_HANDLE,
  ALTERNATE_NAME,
  SITE_URL,
  TITLE,
  DESCRIPTION,
} from "../lib/constants";

interface MetaProps {

}

export default function Meta({
  description = DESCRIPTION,
  title,
  date = null,
  lastUpdated = null,
  type = "website",
  subtitle = "",
  image = "https://macarthur.me/open-graph.jpg",
}) {
  const router = useRouter();
  const url = `${SITE_URL}${router.asPath}`.replace(/\/$/, "");
  const computedTitle = title ? `${title} // Alex MacArthur` : TITLE;

  const schemaTypes: any[] = [
    {
      "@context": "http://schema.org",
      "@type": "WebSite",
      url: SITE_URL,
      name: TITLE,
      alternateName: subtitle || ALTERNATE_NAME,
    },
  ];

  if (isPost) {
    const blogPostSchemaType: { [key: string]: any } = {
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

    if (subtitle) {
      blogPostSchemaType.alternativeHeadline = subtitle;
    }

    if (lastUpdated) {
      blogPostSchemaType.dateModified = new Date(lastUpdated).toISOString();
    }

    schemaTypes.push(blogPostSchemaType);
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "http://schema.org",
            "@graph": schemaTypes,
          }),
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
