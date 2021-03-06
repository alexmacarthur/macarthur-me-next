import { SITE_URL } from "../lib/constants";
import LinkedInIcon from "./icon-linkedin";
import TwitterIcon from "./icon-twitter";
import FacebookIcon from "./icon-facebook";
import { createElement } from "react";

const SocialShare = ({ title, url }) => {
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}%20-%20@amacarthur%0A%0A${url}`,
      icon: TwitterIcon,
    },
    {
      url: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      icon: FacebookIcon,
    },
    {
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodedTitle}&source=${SITE_URL}`,
      icon: LinkedInIcon,
    },
  ];

  return (
    <div className="mt-16">
      <hr className="divider" />

      <div className="flex flex-col-reverse md:flex-row justify-between items-center py-14 md:space-x-6">
        <span className="text-center md:text-left block prose">
          Did this post make you feel something? Share it!
        </span>

        <ul className="flex space-x-1 mb-3 md:mb-0">
          {links.map((link) => {
            const { icon, url } = link;

            return (
              <li key={url}>
                <a href={url} className="block w-8 h-8">
                  {createElement(icon as any)}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <hr className="divider" />
    </div>
  );
};

export default SocialShare;
